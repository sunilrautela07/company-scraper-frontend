import React, { useEffect, useState } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Paper,
  Link as MuiLink,
  Box,
  styled,
  Grid,
  Breadcrumbs,
  Link,
  TextField,
  Button,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import DescriptionIcon from '@mui/icons-material/Description';
import LanguageIcon from '@mui/icons-material/Language';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const RootContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

const CompanyHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  justifyContent: 'space-between',
}));

const CompanyLogo = styled('img')(({ theme }) => ({
  width: 100,
  height: 100,
  marginRight: theme.spacing(2),
}));

const DetailRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
}));

const DetailLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginRight: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
}));

const DetailValue = styled(Typography)(({ theme }) => ({
  wordBreak: 'break-all',
}));

const Screenshot = styled('img')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(2),
}));

const SearchBarContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const SearchField = styled(TextField)(({ theme }) => ({
  marginRight: theme.spacing(2),
  flex: 1,
}));

const CompanyDetails = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [domain, setDomain] = useState('');

  const fetchCompany = async (companyId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/companies/${companyId}`);
      setCompany(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCompany(id);
    }
  }, [id]);

  const handleFetchAndSave = () => {
    // Implement fetch and save logic here
    console.log('Fetch and save details for:', domain);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error.message}</Typography>;
  if (!company) return <Typography>No company data found</Typography>;

  // Debugging logs
  console.log('Company data:', company);

  return (
    <RootContainer>
      <SearchBarContainer>
        <SearchField
          label="Enter domain name"
          variant="outlined"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleFetchAndSave}>
          Fetch & Save Details
        </Button>
      </SearchBarContainer>
      <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: 2 }}>
        <Link component={RouterLink} to="/">
          Home
        </Link>
        <Typography color="textPrimary">{company.name}</Typography>
      </Breadcrumbs>
      <CompanyHeader>
        <Box display="flex" alignItems="center">
          {company.logo && (
            <CompanyLogo
              src={`http://localhost:8000/logos/${company.logo.split('/').pop()}`}
              alt={company.name}
            />
          )}
          <Box>
            <Typography variant="h4">{company.name}</Typography>
            <DetailRow>
              <DetailLabel>
                <DescriptionIcon />
                &nbsp;Description:
              </DetailLabel>
              <DetailValue>{company.description}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>
                <PhoneIcon />
                &nbsp;Phone:
              </DetailLabel>
              <DetailValue>{company.phone}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>
                <EmailIcon />
                &nbsp;Email:
              </DetailLabel>
              <DetailValue>{company.email}</DetailValue>
            </DetailRow>
          </Box>
        </Box>
      </CompanyHeader>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>Company Details</Typography>
            <DetailRow>
              <DetailLabel>
                <LanguageIcon />
                &nbsp;Website:
              </DetailLabel>
              <MuiLink href={`http://${company.website}`} component={DetailValue}>
                {company.website}
              </MuiLink>
            </DetailRow>
            <DetailRow>
              <DetailLabel>
                <DescriptionIcon />
                &nbsp;Description:
              </DetailLabel>
              <DetailValue>{company.description}</DetailValue>
            </DetailRow>
            <DetailRow>
              <DetailLabel>
                <EmailIcon />
                &nbsp;Email:
              </DetailLabel>
              <DetailValue>{company.email}</DetailValue>
            </DetailRow>
            {company.facebook && (
              <DetailRow>
                <DetailLabel>
                  <FacebookIcon />
                  &nbsp;Facebook:
                </DetailLabel>
                <MuiLink href={company.facebook} component={DetailValue}>
                  {company.facebook.split('/').pop()}
                </MuiLink>
              </DetailRow>
            )}
            {company.instagram && (
              <DetailRow>
                <DetailLabel>
                  <InstagramIcon />
                  &nbsp;Instagram:
                </DetailLabel>
                <MuiLink href={company.instagram} component={DetailValue}>
                  {company.instagram.split('/').pop()}
                </MuiLink>
              </DetailRow>
            )}
            {company.twitter && (
              <DetailRow>
                <DetailLabel>
                  <TwitterIcon />
                  &nbsp;Twitter:
                </DetailLabel>
                <MuiLink href={company.twitter} component={DetailValue}>
                  {company.twitter.split('/').pop()}
                </MuiLink>
              </DetailRow>
            )}
            {company.linkedin && (
              <DetailRow>
                <DetailLabel>
                  <LinkedInIcon />
                  &nbsp;LinkedIn:
                </DetailLabel>
                <MuiLink href={company.linkedin} component={DetailValue}>
                  {company.linkedin.split('/').pop()}
                </MuiLink>
              </DetailRow>
            )}
            <DetailRow>
              <DetailLabel>
                <DescriptionIcon />
                &nbsp;Address:
              </DetailLabel>
              <DetailValue>{company.address}</DetailValue>
            </DetailRow>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          {company.screenshot && (
            <Paper elevation={3} sx={{ padding: 2 }}>
              <Typography variant="h6" sx={{ marginBottom: 2 }}>Screenshot of Webpage</Typography>
              <Screenshot
                src={`http://localhost:8000/screenshots/${company.screenshot.split('/').pop()}`}
                alt="Website screenshot"
              />
              {/* Debugging logs */}
              {console.log('Screenshot URL:', `http://localhost:8000/screenshots/${company.screenshot.split('/').pop()}`)}
            </Paper>
          )}
        </Grid>
      </Grid>
    </RootContainer>
  );
};

export default CompanyDetails;
