import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import axios from 'axios';
import { AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,  Button, Input, InputGroup, InputRightElement, Table, Thead, Tbody, Tr, Th, Td, Heading } from '@chakra-ui/react';
  import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    useDisclosure,
  } from '@chakra-ui/react';


function Search() {
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const onClose = () => setIsOpenAlert(false);
  const [articleData, setArticleData] = useState(null);
  const [searchedWord, setSearchedWord] = useState('');

  const [selectedArticle, setSelectedArticle] = useState(null);
  const [modalType, setModalType] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = (article, type) => {
    setSelectedArticle(article);
    setModalType(type);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedArticle(null);
    setModalType('');
    setIsOpen(false);
  };



  const handleClick = async () => {
    try {
      setIsOpenAlert(true);
      const searchText = document.getElementById('searchField').value;
      setSearchedWord(searchText); // Set the searched word
      const response = await axios.post('http://localhost:3000/sonuclar', {
        text: searchText,
      });

      setArticleData(response.data);
    } catch (error) {
      console.error('İstek gönderilirken bir hata oluştu:', error);
    }
  };

  return (
    <div className="container">
      <div className="search-box">
        
        <InputGroup>
        <Link to="/">
            <Button
              colorScheme="blue"
              h="2.5rem"
              size="md"
              _hover={{ bg: 'blue.500' }}
              mr={2}
            >
              Geri Dön
            </Button>
          </Link>
          <Input
            type="text"
            id="searchField"
            placeholder="Arama yap"
            variant="filled"
            _focus={{ borderColor: 'blue.400' }}
            mr="2"
          />
          <Button
            colorScheme="blue"
            h="2.5rem"
            size="md"
            onClick={handleClick}
            _hover={{ bg: 'blue.500' }}
            mr={2}
          >
            Ara
          </Button>
          {" "} {/* Boşluk */}

          
        </InputGroup>
      </div>
      {searchedWord && (
        <Heading style={{ color: 'blue' }} as="h1" size="xl" mb="4">
           Aratılan Makale: <span style={{ color: 'green' }}>{searchedWord}</span>
        </Heading>
      )}
      {articleData && (
        <Table variant="striped" colorScheme="gray">
          <Thead>
            <Tr>
              <Th>
                <a style={{ color: 'red' }} href="#" >PDF</a>
              </Th>
              <Th style={{ color: 'red' }} >Özet</Th>
              <Th style={{ color: 'red' }} >Başlık</Th>
              <Th>
                <a style={{ color: 'red' }} href="#" >URL</a>
              </Th>
              <Th style={{ color: 'red' }} >Yazarlar</Th>
              <Th style={{ color: 'red' }} >Yayıncı</Th> {/* Yayıncı sütunu eklendi */}
              <Th style={{ color: 'red' }} >Tür</Th>
              <Th style={{ color: 'red' }} >Tarih</Th>
              <Th style={{ color: 'red' }} >Anahtar Kelimeler</Th>
              <Th style={{ color: 'red' }} >Referanslar</Th> {/* Referanslar sütunu eklendi */}
            </Tr>
          </Thead>
          <Tbody>
            {articleData.map((article, index) => (
              <Tr key={index}>
                <Td>
                  <a href={article.articlePdfLink} style={{ color: 'blue' }}>{article.articlePdfLink}</a>
                </Td>
                <Td><Button onClick={() => handleOpenModal(article, 'abstract')}>Özet Göster</Button></Td>
                <Td>{article.articleTitle}</Td>
                <Td>
                  <a href={article.articleLink} style={{ color: 'blue' }}>{article.articleLink}</a>
                </Td>
                <Td>{article.articleAuthor}</Td>
                <Td>{article.articlePublisher}</Td> {/* Yayıncı verisi eklendi */}
                <Td>{article.articleType}</Td>
                <Td>{article.articleDate}</Td>
                <Td>{article.articleKeywords.join(', ')}</Td>
                <Td><Button onClick={() => handleOpenModal(article, 'references')}>Referansları Göster</Button></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

      )}

      <Modal isOpen={isOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedArticle && selectedArticle.articleTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {modalType === 'references' && selectedArticle && selectedArticle.articleReferences && (
              <>
                <Heading size="md" mb={2}>Referanslar:</Heading>
                {selectedArticle.articleReferences.map((reference, index) => (
                  <p key={index}>{reference}</p>
                ))}
              </>
            )}
            {modalType === 'abstract' && selectedArticle && (
              <>
                <Heading size="md" mb={2}>Özet:</Heading>
                <p>{selectedArticle.articleAbstract}</p>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <AlertDialog isOpen={isOpenAlert} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Başarılı!
            </AlertDialogHeader>
            <AlertDialogBody>
              İşlem başarılı: Lütfen bir süre bekleyin.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button colorScheme="blue" onClick={onClose}>
                Tamam
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </div>
  );
}

export default Search;
