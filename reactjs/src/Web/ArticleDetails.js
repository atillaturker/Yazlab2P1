import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Box, Heading, Text, Link, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';
import { List, ListItem, ListIcon } from '@chakra-ui/react';
import { MinusIcon,ChevronRightIcon } from '@chakra-ui/icons';

function ArticleDetails() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/article/${id}`);
        setArticle(response.data);
      } catch (error) {
        console.error('Makale getirilirken bir hata oluştu:', error);
      }
    };

    

    fetchArticle();
  }, [id]);
  return (
    // Use a Box component to wrap the article details
    <Box p={4} bg="gray.50" borderRadius="md">
      <List spacing={3}>
        <ListItem>
          <Heading color="green.500" size="md">Makale Başlık</Heading>
          <Text fontWeight="bold" fontSize="s" lineHeight="1.5" color="gray.900"> <ListIcon boxSize={3} as={MinusIcon} color="red"/>{article?.articleTitle} </Text>
        </ListItem>
        <ListItem>
          <Heading  color="green.500" size="md">Makale Yayıncı</Heading>
          <Text fontWeight="bold" fontSize="s" lineHeight="1.5" color="gray.900"> <ListIcon boxSize={3} as={MinusIcon} color="red"/>{article?.articlePublisher} </Text>
        </ListItem>
        <ListItem>
          <Heading  color="green.500" size="md">Makale Yazar</Heading>
          <Text fontWeight="bold" fontSize="s" lineHeight="1.5" color="gray.900"> <ListIcon boxSize={3} as={MinusIcon} color="red"/>{article?.articleAuthor} </Text>
        </ListItem>
        <ListItem>
          <Heading  color="green.500" size="md">Makale Tarih</Heading>
          <Text fontWeight="bold" fontSize="s" lineHeight="1.5" color="gray.900"> <ListIcon boxSize={3} as={MinusIcon} color="red"/>{article?.articleDate} </Text>
        </ListItem>
        <ListItem>
        <Heading  color="green.500" size="md">Makale Tür</Heading>
          <Text fontWeight="bold" fontSize="s" lineHeight="1.5" color="gray.900"> <ListIcon boxSize={3} as={MinusIcon} color="red"/>{article?.articleType} </Text>
        </ListItem>
        <ListItem>
        <Heading  color="green.500" size="md">Makale PDF</Heading>
          <Text fontWeight="bold" fontSize="s" lineHeight="1.5" color="gray.900"> <ListIcon boxSize={3} as={MinusIcon} color="red"/> <Link href={article?.articlePdflink} target="_blank" color="gray.900">{article?.articlePdfLink}</Link> </Text>
        </ListItem>
        <ListItem>
        <Heading  color="green.500" size="md">Makale URL</Heading>
          <Text fontWeight="bold" fontSize="s" lineHeight="1.5" color="gray.900"> <ListIcon boxSize={3} as={MinusIcon} color="red"/> <Link href={article?.articleLink} target="_blank" color="gray.900">{article?.articleLink}</Link> </Text>
        </ListItem>
        <ListItem>
        <Heading  color="green.500" size="md">Makale Anahtar Kelimeler</Heading>
          <Text fontWeight="bold" fontSize="s" lineHeight="1.5" color="gray.900"> <ListIcon boxSize={3} as={MinusIcon} color="red"/>{article?.articleKeywords.join(',')} </Text>
        </ListItem>
        <ListItem>
        <Heading  color="green.500" size="md">Makale Özet</Heading>
          <Text fontWeight="bold" fontSize="xs" lineHeight="1.5" color="gray.900"> <ListIcon boxSize={3} as={MinusIcon} color="red"/>{article?.articleAbstract} </Text>
        </ListItem>
        <ListItem>
          <Heading color="green.500" size="md">Makale Referans</Heading>
          {article && article.articleReferences && article.articleReferences.map((reference, index) => (
            <Text key={index} fontWeight="bold" fontSize="xs" lineHeight="1.5" color="gray.900">
              <ListIcon boxSize={3} as={MinusIcon} color="red"/>
              {reference}
            </Text>
          ))}
        </ListItem>
      </List>
    </Box>
  );
}

export default ArticleDetails;
