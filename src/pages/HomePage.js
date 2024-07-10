import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Container, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody,
  Checkbox, Typography, Paper, IconButton, TableContainer, Box
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
}));

const StyledLogo = styled('img')({
  width: 40,
  height: 40,
  marginRight: 10,
  borderRadius: '50%',
});

const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main,
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const HomePage = () => {
  const [domain, setDomain] = useState('');
  const [companies, setCompanies] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState({});
  const [totalPages, setTotalPages] = useState(10);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    const response = await axios.get('http://localhost:8000/api/companies');
    setCompanies(response.data);
    setTotalPages(Math.ceil(response.data.length / 10));
  };

  const handleFetch = async () => {
    if (!/^(ftp|http|https):\/\/[^ "]+$/.test(domain)) {
      alert('Please enter a valid URL');
      return;
    }
    await axios.post('http://localhost:8000/api/companies/scrape', { url: domain });
    fetchCompanies();
  };

  const handleCheckboxChange = (id) => {
    setSelectedCompanies(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDelete = async () => {
    const idsToDelete = Object.keys(selectedCompanies).filter(id => selectedCompanies[id]);
    await Promise.all(idsToDelete.map(id => axios.delete(`http://localhost:8000/api/companies/${id}`)));
    fetchCompanies();
  };

  const handleDownloadCsv = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "ID,Name,Description,Address,Phone,Email\n";
    companies.forEach(company => {
      const row = `${company.id},${company.name},${company.description},${company.address},${company.phone},${company.email}`;
      csvContent += row + "\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "companies.csv");
    link.click();
  };

  return (
    <Container maxWidth="xl">
      <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
        <Box display="flex" alignItems="center">
          <TextField
            label="Enter domain name"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleFetch}
            size="small"
            style={{ height: '40px', marginLeft: '10px' }}
          >
            Fetch & Save Details
          </Button>
        </Box>
        <Box display="flex" alignItems="center" marginTop="10px">
          <Button startIcon={<DownloadIcon />} onClick={handleDownloadCsv}>
            Download CSV
          </Button>
          <Button startIcon={<DeleteIcon />} onClick={handleDelete} style={{ marginLeft: '10px' }} color="error">
            Delete Selected
          </Button>
        </Box>
      </Paper>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell padding="checkbox">
                <Checkbox
                  indeterminate={Object.values(selectedCompanies).some(value => value) && Object.values(selectedCompanies).some(value => !value)}
                  checked={companies.length > 0 && Object.values(selectedCompanies).every(value => value)}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    const newSelectedCompanies = {};
                    companies.forEach(company => {
                      newSelectedCompanies[company.id] = isChecked;
                    });
                    setSelectedCompanies(newSelectedCompanies);
                  }}
                />
              </StyledTableCell>
              <StyledTableCell>COMPANY</StyledTableCell>
              <StyledTableCell>SOCIAL PROFILES</StyledTableCell>
              <StyledTableCell>DESCRIPTION</StyledTableCell>
              <StyledTableCell>ADDRESS</StyledTableCell>
              <StyledTableCell>PHONE NO.</StyledTableCell>
              <StyledTableCell>EMAIL</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={!!selectedCompanies[company.id]}
                    onChange={() => handleCheckboxChange(company.id)}
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <StyledLogo src={`http://localhost:8000/logos/${company.logo.split('/').pop()}`} alt={company.name} />
                    <StyledLink to={`/company/${company.id}`}>
                      {company.name}
                    </StyledLink>
                  </Box>
                </TableCell>
                <TableCell>
                  {company.facebook && (
                    <IconButton size="small" component="a" href={company.facebook} target="_blank">
                      <FacebookIcon />
                    </IconButton>
                  )}
                  {company.twitter && (
                    <IconButton size="small" component="a" href={company.twitter} target="_blank">
                      <TwitterIcon />
                    </IconButton>
                  )}
                  {company.linkedin && (
                    <IconButton size="small" component="a" href={company.linkedin} target="_blank">
                      <LinkedInIcon />
                    </IconButton>
                  )}
                </TableCell>
                <TableCell>{company.description}</TableCell>
                <TableCell>{company.address}</TableCell>
                <TableCell>{company.phone}</TableCell>
                <TableCell>{company.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default HomePage;
