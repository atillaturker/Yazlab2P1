import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Box, Flex, Heading, Text, Input, Select, Button, Grid } from '@chakra-ui/react';

function Homepage() {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('all');
  const [sortOption, setSortOption] = useState('latest');

  useEffect(() => {
    axios.get('http://localhost:3000/getArticles')
      .then(response => {
        console.log("Sunucudan gelen makaleler:", response.data);
        setArticles(response.data);
      })
      .catch(err => console.log(err));
  }, []);

  // Filter articles based on search term and filter option
  const filteredArticles = articles.filter(article => {
    if (filterOption === 'all') {
      return article.articleTitle.toLowerCase().includes(searchTerm.toLowerCase());
    } else {
      return article.articleType === filterOption && article.articleTitle.toLowerCase().includes(searchTerm.toLowerCase());
    }
  });

  // Sort articles based on sort option
  const sortedArticles = filteredArticles.sort((a, b) => {
    if (sortOption === 'latest') {
      console.log(new Date(b.articleDate) - new Date(a.articleDate))
      return new Date(b.articleDate) - new Date(a.articleDate);
    } else {
      return new Date(a.articleDate) - new Date(b.articleDate);
    }
  });

  return (
    
    <Box p={7}>
      <Flex justify="space-between" mb={4} alignItems="center">
        <Input mr="2"  placeholder="Search articles..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        
        <Select mr="2" w="200px" value={filterOption} onChange={(e) => setFilterOption(e.target.value)}>
          <option value="all">All Types</option>
          <option value="research">Research</option>
          <option value="review">Review</option>
          <option value="case-study">Case Study</option>
        </Select>
        <Select w="200px" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="latest">Latest First</option>
          <option value="oldest">Oldest First</option>
        </Select>
      </Flex>
      <Flex justify="center" >
        <Button mb="4" colorScheme="teal" as={Link} to="/search" >Makale Scrap Yap</Button>
      </Flex>
      
      <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={4}>
  {sortedArticles.map((article, index) => (
    <Box key={index} p={3} borderWidth="1px" borderRadius="md" boxShadow="md">
      <Link to={`/article/${article._id}`}>
        <Heading as="h3" size="sm" mb={2} _hover={{ color: "blue.500", textDecoration: "underline" }}>{article.articleTitle}</Heading>
      </Link>
      <Text fontSize="sm" color="gray.500">{article.articlePublisher}, {article.articleDate}</Text>
    </Box>
  ))}
</Grid>
      
    </Box>
  );
}

export default Homepage;
