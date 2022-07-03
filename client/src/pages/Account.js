import * as React from 'react';

// mui
import { Container, Typography, Box, Grid, Stack } from '@mui/material';

// components
import Page from '../components/Page';
import AccountProfile from '../sections/@dashboard/account/AccountProfile';
import AccountProfileDetail from '../sections/@dashboard/account/AccountProfileDetail';

export default function Account() {
  console.log('Account render');

  return (
    <Page title="Account">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {/* @Account */}
            账户
          </Typography>
        </Stack>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8,
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={3}>
              <Grid item lg={4} md={6} xs={12}>
                <AccountProfile />
              </Grid>
              <Grid item lg={8} md={6} xs={12}>
                <AccountProfileDetail />
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Container>
    </Page>
  );
}
