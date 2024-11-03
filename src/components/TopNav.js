import { useState } from 'react';
import { Container, TextField, Button, Snackbar, AppBar, Toolbar, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

export default function TopNav({ updateAnimeList }) {
  const [animeData, setAnimeData] = useState({
    title: '',
    rating: '',
    image: 'default',
    description: '',
    link: '',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'rating') {
      // Allow only numeric values between 0 and 10
      const numericValue = Number(value);
      if (numericValue >= 0 && numericValue <= 10) {
        setAnimeData({ ...animeData, [name]: value });
      }
    } else {
      setAnimeData({ ...animeData, [name]: value });
    }
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    // Clear form fields
    setAnimeData({
      title: '',
      rating: '',
      description: '',
      link: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://anilist-nine.vercel.app/api/list/route', animeData);
      setSnackbarMessage('Anime added successfully');
      setSnackbarOpen(true);
      handleDialogClose(); // Close the dialog after successful submission
      updateAnimeList(); // Fetch updated anime list
    } catch (error) {
      console.error('Error adding anime:', error);
      setSnackbarMessage('Failed to add anime');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Anime List
          </Typography>
          <IconButton color="inherit" onClick={handleDialogOpen}>
            <AddIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Add Anime</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              margin='normal'
              name="title"
              label="Anime Name"
              fullWidth
              value={animeData.title}
              onChange={handleChange}
              required
            />
            <TextField
              margin='normal'
              name="rating"
              label="Rating / 10"
              type="number"
              fullWidth
              value={animeData.rating}
              onChange={handleChange}
              inputProps={{ min: 0, max: 10 }}
              required
            />
            {/* <TextField
              margin='normal'
              name="image"
              label="Image URL"
              fullWidth
              value={animeData.image}
              onChange={handleChange}
            /> */}
            <TextField
              margin='normal'
              name="description"
              label="Short Description"
              multiline
              fullWidth
              value={animeData.description}
              onChange={handleChange}
              required
            />
            <TextField
              margin='normal'
              name="link"
              label="Site Name"
              fullWidth
              value={animeData.link}
              onChange={handleChange}
              required
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Add Anime
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </>
  );
}
