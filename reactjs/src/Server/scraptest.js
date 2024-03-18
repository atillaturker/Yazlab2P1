const puppeteer = require('puppeteer');

async function searchAndVisitArticles(searchTerm) {
    try {
        const browser = await puppeteer.launch({ headless: true }); // headless modda çalıştır
        const page = await browser.newPage();

        // DergiPark ana sayfasına git
        await page.goto(`https://dergipark.org.tr/tr/search?q=${encodeURIComponent(searchTerm)}&section=articles`, { waitUntil: "domcontentloaded" });

        // Tüm makale kartlarını bulun
        const articleCards = await page.$$('.card.article-card.dp-card-outline');

        // Makale kartlarını işlemek için paralel işlem yapın
        const results = await Promise.all(articleCards.map(async (card) => {
            // Makale linkini al
            const link = await card.$eval('.card-title a', a => a.href);

            // Yeni bir sayfa oluştur ve makale sayfasına git
            const articlePage = await browser.newPage();
            await articlePage.goto(link, { waitUntil: "domcontentloaded" });

            // Beklenen elementin varlığını kontrol et
            const elementExists = await articlePage.waitForSelector('.article-title', { timeout: 3000 }).then(() => true).catch(() => false);
            if (!elementExists) {
                console.log(`Makale sayfasında beklenen element bulunamadı. URL: ${link}`);
                await articlePage.close();
                return null; // Bu makaleyi atla ve null döndür
            }

            const articlePublisher = await articlePage.$eval('#journal-title', element => element.textContent.trim());

            let articleTitle = null;

            const articleTitleTR = await articlePage.evaluate(() => {
                const trTitleElement = document.querySelector('#article_tr .article-title');
                return trTitleElement ? trTitleElement.textContent.trim() : null;
            });

            const articleTitleEN = await articlePage.evaluate(() => {
                const enTitleElement = document.querySelector('#article_en .article-title');
                return enTitleElement ? enTitleElement.textContent.trim() : null;
            });
            
            if (articleTitleTR) {
                articleTitle = articleTitleTR;
            } else if (articleTitleEN) {
                articleTitle = articleTitleEN;
            } else {
                console.log("Başlık bulunamadı.");
            }
            
            

            const articleAuthor = await articlePage.$eval('.article-authors', author => author.innerText.trim().replace(/\s+/g, ' '));
            const [articleType, articleDate] = await articlePage.evaluate(() => {
                const tableRows = document.querySelectorAll('.record_properties tbody tr');
                let articleType = '';
                let articleDate = '';
                tableRows.forEach(row => {
                    const thText = row.querySelector('th').innerText.trim();
                    if (thText === 'Bölüm') {
                        articleType = row.querySelector('td').innerText.trim();
                    }
                    if (thText === 'Yayımlanma Tarihi') {
                        articleDate = row.querySelector('td').innerText.trim();
                    }
                });
                return [articleType, articleDate];
            });
            const articleKeywords = await articlePage.evaluate(() => {
                const keywordElements = document.querySelectorAll('.article-keywords a');
                const keywords = [];
                keywordElements.forEach(keyword => {
                    keywords.push(keyword.textContent.trim());
                });
                return keywords;
            });
            const articleAbstract = await articlePage.evaluate(() => {
                const paragraphElements = document.querySelectorAll('.article-abstract p');
                const abstract = [];
                paragraphElements.forEach(paragraph => {
                    const text = paragraph.textContent.trim();
                    if (text !== '') {
                        abstract.push(text);
                    }
                });
                return abstract;
            });
            const articlePdfLink = await articlePage.evaluate(() => {
                const articleToolbar = document.getElementById('article-toolbar');
                const linkElement = articleToolbar.querySelector('a[href*="/tr/download/article-file/"]');
                const baseUrl = 'https://dergipark.org.tr';
                const relativeUrl = linkElement ? linkElement.getAttribute('href') : null;
                return relativeUrl ? baseUrl + relativeUrl : "Pdf Yok";
            });

            // Kaynakça bilgilerini al
            let articleReferences = null;
            const articleReferenceList = await articlePage.$('.article-citations.data-section .fa-ul');
            if (articleReferenceList) {
                articleReferences = await articleReferenceList.$$eval('li', lis => {
                    return lis.map(li => li.textContent.trim());
                });
            }

            // Makale sayfasını kapat
            await articlePage.close();

            
            // Makale objesini döndür
            return {
                articleReferences,
                articlePublisher,
                articleTitle,
                articleAuthor,
                articleType,
                articleDate,
                articleKeywords,
                articleAbstract,
                articlePdfLink,
                articleLink: link,
            };
        }));


        // Null olmayan sonuçları filtrele
        const filteredResults = results.filter(result => result !== null);

        // Tarayıcıyı kapat ve sonuçları döndür
        await browser.close();
        
        return filteredResults;
        
    } catch (error) {
        throw error;
    }
}
module.exports = searchAndVisitArticles;
