import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Skeleton,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import DownloadForOfflineOutlinedIcon from '@mui/icons-material/DownloadForOfflineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import HomeIcon from '@mui/icons-material/Home';
import { useLocation, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../utils/const';

const formatTimestamp = (filename) => {
  if (!filename) return { display: '', sortKey: filename || '' };
  const match = filename.match(
    /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})-(?<hour>\d{2})-(?<min>\d{2})-(?<sec>\d{2})/,
  );
  if (!match) return { display: filename, sortKey: filename };
  const { year, month, day, hour, min, sec } = match.groups;
  return {
    display: `${month}-${day}-${year} ${hour}:${min}:${sec}`,
    sortKey: `${year}-${month}-${day}T${hour}:${min}:${sec}`,
  };
};

const normalizeReport = (report) => {
  const reportType =
    report.report_type ||
    (report.filename && report.filename.toLowerCase().includes('mock') ? 'mock' : 'real');
  const { display, sortKey } = formatTimestamp(report.filename);
  return {
    ...report,
    report_type: reportType,
    timestampLabel: display,
    sortKey,
  };
};

const Stat = ({ label, value, color }) => (
  <Stack spacing={0.5} alignItems='center'>
    <Typography variant='subtitle2' sx={{ color: 'text.secondary' }}>
      {label}
    </Typography>
    <Typography variant='h6' sx={{ color }}>
      {value}
    </Typography>
  </Stack>
);

Stat.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.string,
};

Stat.defaultProps = {
  color: 'text.primary',
};

function ReportSection({ title, reports, onPreview, onDownload }) {
  return (
    <Box sx={{ mt: 3 }}>
      <Stack direction='row' spacing={1} alignItems='center' sx={{ mb: 1 }}>
        <AssessmentOutlinedIcon fontSize='small' sx={{ color: '#0f172a' }} />
        <Typography variant='h5' fontWeight={700}>
          {title}
        </Typography>
      </Stack>
      {reports.length === 0 ? (
        <Alert severity='info' variant='outlined' sx={{ borderStyle: 'dashed' }}>
          No reports found yet.
        </Alert>
      ) : (
        <Grid container spacing={2}>
          {reports.map((report) => {
            const total = (report.pass || 0) + (report.fail || 0);
            const passPercent = total ? Math.round((report.pass / total) * 100) : 0;

            const [batchDate, ...rest] = (report.filename || '').split('_');
            const batchName = rest.join(' ') || 'Batch';

            return (
              <Grid item xs={12} md={6} key={report.filename}>
                <Card
                  sx={{
                    height: '100%',
                    border: '1px solid #dbeafe',
                    background: 'linear-gradient(135deg, #f8fbff 0%, #eef6ff 100%)',
                    boxShadow: '0 4px 14px rgba(15, 23, 42, 0.06)',
                  }}
                >
                  <CardContent>
                    <Stack direction='row' justifyContent='space-between' alignItems='flex-start'>
                      <Box>
                        <Typography variant='h6' fontWeight={700} sx={{ color: '#0f172a' }}>
                          {batchName}
                        </Typography>
                        <Typography variant='body2' sx={{ color: '#475569' }}>
                          {report.timestampLabel}
                        </Typography>
                      </Box>
                      <Stack direction='row' spacing={1}>
                        <Chip
                          label={report.report_type === 'mock' ? 'Mock Simulator' : 'Real'}
                          color={report.report_type === 'mock' ? 'secondary' : 'primary'}
                          size='small'
                          variant='outlined'
                        />
                        {report.contains_fuzzy && (
                          <Chip label='Fuzzy' color='success' size='small' variant='filled' />
                        )}
                      </Stack>
                    </Stack>

                    <Stack direction='row' spacing={3} sx={{ mt: 2, mb: 1 }}>
                      <Stat label='Pass' value={report.pass} color='#16a34a' />
                      <Stat label='Fail' value={report.fail} color='#dc2626' />
                      <Stat label='Drones' value={report.drone_count} color='#0ea5e9' />
                      <Stat label='Pass %' value={`${passPercent}%`} color='#334155' />
                    </Stack>
                  </CardContent>
                  <Divider />
                  <CardActions sx={{ justifyContent: 'space-between' }}>
                    <Button
                      size='small'
                      startIcon={<VisibilityOutlinedIcon />}
                      onClick={() => onPreview(report)}
                    >
                      Preview
                    </Button>
                    <Tooltip title='Download report (.zip)'>
                      <IconButton onClick={() => onDownload(report)} color='primary'>
                        <DownloadForOfflineOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}

ReportSection.propTypes = {
  title: PropTypes.string.isRequired,
  reports: PropTypes.arrayOf(PropTypes.object).isRequired,
  onPreview: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
};

export default function ReportDashboard() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackOpen, setSnackOpen] = useState(false);
  const [previewing, setPreviewing] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  const isReportsPage = location.pathname.includes('/reports');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError('');
      try {
        const res = await fetch(`${BASE_URL}/list-reports`);
        if (!res.ok) throw new Error('Failed to fetch reports');
        const data = await res.json();
        setReports(data.reports ?? []);
        setSnackOpen((data.reports ?? []).length === 0);
      } catch (err) {
        console.error(err);
        setError('Could not load reports.');
        setSnackOpen(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const groupedReports = useMemo(() => {
    const normalized = (reports || []).map(normalizeReport).sort((a, b) =>
      a.sortKey < b.sortKey ? 1 : -1,
    );
    return normalized.reduce(
      (acc, report) => {
        const key = report.report_type === 'mock' ? 'mock' : 'real';
        acc[key].push(report);
        return acc;
      },
      { mock: [], real: [] },
    );
  }, [reports]);

  const handlePreview = async (report) => {
    setPreviewing(report.filename);
    try {
      const res = await fetch(`${BASE_URL}/list-folder-contents/${encodeURIComponent(report.filename)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to load report contents');
      const data = await res.json();
      navigate('/dashboard', {
        state: {
          data,
          file: { fuzzy: report.contains_fuzzy, fileName: report.filename, fail: report.fail },
        },
      });
    } catch (err) {
      console.error(err);
      setError('Unable to open report. Please try again.');
      setSnackOpen(true);
    } finally {
      setPreviewing('');
    }
  };

  const handleDownload = (report) => {
    const url = `${BASE_URL}/download-report/${encodeURIComponent(report.filename)}`;
    window.open(url, '_blank');
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #e0f2fe 0%, #f8fafc 100%)',
        py: 4,
      }}
    >
      <Container maxWidth='lg'>
        <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ mb: 3 }}>
          <Box>
            <Typography variant='h4' fontWeight={800} sx={{ color: '#0f172a' }}>
              Reports
            </Typography>
            <Typography variant='body1' sx={{ color: '#475569' }}>
              View, preview, and download simulation reports. Mock simulator runs are shown
              separately from real flights.
            </Typography>
          </Box>
          {isReportsPage && (
            <Button
              variant='contained'
              startIcon={<HomeIcon />}
              onClick={() => navigate('/')}
              sx={{ bgcolor: '#1e3a8a', '&:hover': { bgcolor: '#172554' } }}
            >
              Home
            </Button>
          )}
        </Stack>

        {error && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {isLoading ? (
          <Grid container spacing={2}>
            {[1, 2, 3, 4].map((item) => (
              <Grid item xs={12} md={6} key={item}>
                <Skeleton variant='rectangular' height={180} sx={{ borderRadius: 2 }} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <>
            <ReportSection
              title='Mock Simulator Reports'
              reports={groupedReports.mock}
              onPreview={handlePreview}
              onDownload={handleDownload}
            />
            <ReportSection
              title='Real Reports'
              reports={groupedReports.real}
              onPreview={handlePreview}
              onDownload={handleDownload}
            />
          </>
        )}

        <Snackbar
          open={snackOpen}
          autoHideDuration={6000}
          onClose={() => setSnackOpen(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={() => setSnackOpen(false)} severity={error ? 'error' : 'info'} sx={{ width: '100%' }}>
            {error || 'No reports found yet.'}
          </Alert>
        </Snackbar>

        {previewing && (
          <Stack direction='row' spacing={1} alignItems='center' sx={{ mt: 2, color: '#0f172a' }}>
            <CircularProgress size={18} />
            <Typography variant='body2'>Loading {previewing}…</Typography>
          </Stack>
        )}
      </Container>
    </Box>
  );
}

ReportDashboard.propTypes = {
  isHomePage: PropTypes.bool,
};
