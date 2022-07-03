import * as React from 'react';
// @mui
import { Container, Typography } from '@mui/material';

// components
import Page from '../components/Page';

export default function Setting() {
  return (
    <Page title="Setting">
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Setting
        </Typography>
      </Container>
    </Page>
  );
}
