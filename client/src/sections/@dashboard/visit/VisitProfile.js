import * as React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, Divider, TextField, Stack } from '@mui/material';

VisitProfile.propTypes = {
  visitProfile: PropTypes.object,
};

export default function VisitProfile({ visitProfile }) {
  const { university, college, major, goodAt } = visitProfile;
  return (
    <Card>
      {/* <CardHeader subheader="" title="Profile" /> */}
      <CardHeader subheader="" title="简介" />
      <Divider />
      <CardContent>
        <Stack spacing={3}>
          <TextField
            InputProps={{ readOnly: true }}
            fullWidth
            autoComplete="university"
            type="text"
            label="University"
            value={university || ''}
          />
          <TextField
            InputProps={{ readOnly: true }}
            fullWidth
            autoComplete="college"
            type="text"
            label="College"
            value={college || ''}
          />
          <TextField
            InputProps={{ readOnly: true }}
            fullWidth
            autoComplete="major"
            type="text"
            label="Major"
            value={major || ''}
          />
          <TextField
            InputProps={{ readOnly: true }}
            fullWidth
            autoComplete="goodAt"
            type="text"
            label="Good At"
            value={goodAt || ''}
          />
        </Stack>
      </CardContent>
      <Divider />
    </Card>
  );
}
