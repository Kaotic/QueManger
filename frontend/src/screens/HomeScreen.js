import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import api from '../utils/api';
import { Grid, Button, Paper, List, ListItem, ListItemButton, Avatar, ListItemText, ListItemAvatar, ListItemIcon, Card } from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import DangerousIcon from '@mui/icons-material/Dangerous';
import StarRateIcon from '@mui/icons-material/StarRate';
import EuroIcon from '@mui/icons-material/Euro';
import RamenDiningIcon from '@mui/icons-material/RamenDining';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import moment from 'moment/moment';
import { red } from '@mui/material/colors';
import { translateCost, translateDifficulty, translateTime } from '../utils/translation';
import { useSnackbar } from 'notistack';

function HomeScreen() {
	const { enqueueSnackbar } = useSnackbar();
	const user = useSelector((state) => state.user);
	const dispatch = useDispatch();

	const [isLoading, setIsLoading] = React.useState(false);
	const [recipesList, setRecipesList] = React.useState([]);
	const [selectedList, setSelectedList] = React.useState([]);
	const [selectedRecipe, setSelectedRecipe] = React.useState(null);
	const [marmitonUrl, setMarmitonUrl] = React.useState('');
	const [marmitonRecipe, setMarmitonRecipe] = React.useState('');

	const refreshLists = () => {
		setIsLoading(true);
		api.get('/api/user/recipes', { headers: { Authorization: `Bearer ${user.auth.access}` } })
			.then((response) => {
				if(response.status === 200){
					setRecipesList(response.data);
					setIsLoading(false);
				}
			})
			.catch((error) => {
				console.log(error);
				setIsLoading(false);
			});
	};

	const handleSelectRecipe = (recipe) => {
		setSelectedRecipe(recipe);
		if(recipe?.marmiton_url) {
			setMarmitonUrl('http://localhost:8000/api/marmiton/fetch?url=' + recipe.marmiton_url);
		}
	};

	const handleRandomRecipe = () => {
		setIsLoading(true);
		api.get('/api/marmiton/add/random')
			.then((response) => {
				if(response.status === 200){
					handleSelectRecipe(response.data);
					setIsLoading(false);
				}
			})
			.catch((error) => {
				console.log(error);
				setIsLoading(false);
				enqueueSnackbar('Une erreur est survenue lors de la récupération de la recette !', { variant: 'error' });
			});
	};

	const handleAddRecipeToList = () => {
		setIsLoading(true);

		if(selectedList.length === 0){
			enqueueSnackbar('Aucune liste sélectionnée !', { variant: 'error' });
			setIsLoading(false);
			return;
		}

		for(let i = 0; i < selectedList.recipes.length; i++){
			if(selectedList.recipes[i].id === selectedRecipe.id){
				enqueueSnackbar('La recette est déjà dans la liste !', { variant: 'error' });
				setIsLoading(false);
				return;
			}
		}

		api.get(`/api/user/recipes/${selectedList.id}/add/${selectedRecipe.marmiton_id}`, { headers: { Authorization: `Bearer ${user.auth.access}` } })
			.then((response) => {
				if(response.status === 200){
					setIsLoading(false);
					enqueueSnackbar('Recette ajoutée à la liste.', { variant: 'success' });
					selectedList.recipes.push(selectedRecipe);
				}
			})
			.catch((error) => {
				console.log(error);
				setIsLoading(false);
				enqueueSnackbar('Une erreur est survenue lors de l\'ajout de la recette à la liste !', { variant: 'error' });
			});
	};

	const handleOpenMarmiton = () => {
		window.open(selectedRecipe.marmiton_url, '_blank');
	};

	React.useEffect(() => {
		refreshLists();
	}, []);

	return (
        <Container component="main" maxWidth={false} style={{ flexGrow: 1, padding: '2rem' }}>
            <Grid container spacing={3}>
                {/* Première colonne : Liste de mes recettes */}
                <Grid item xs={3}>
                    <Paper elevation={3}>
                        <Typography variant="h6" sx={{textAlign: 'center'}}>Listes de recettes</Typography>
                        <List>
                            {recipesList.map((list) => (
                                <ListItemButton button onClick={() => setSelectedList(list)} key={list.id}>
									<ListItemAvatar>
										<Avatar sx={{ bgcolor: 'primary.main' }}>#{list.id}</Avatar>
									</ListItemAvatar>
									<ListItemText primary={`Semaine ${list.date_week} (${moment(list.date_created).format('DD/MM/YYYY')})`} secondary={`Contient ${list.recipes.length} recette${list.recipes.length > 1 ? 's' : ''}`} />
									<ListItemIcon>
										{list.id === selectedList.id ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
									</ListItemIcon>
                                </ListItemButton>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* Deuxième colonne : Liste des recettes dans la liste sélectionnée */}
                <Grid item xs={3}>
                    <Paper elevation={3}>
                        <Typography variant="h6" sx={{textAlign: 'center'}}>Recettes dans la liste</Typography>
                        <List>
                            {selectedList.recipes?.map((recipe) => (
                                <ListItemButton button onClick={() => handleSelectRecipe(recipe)} key={recipe.id}>
									<ListItemAvatar>
										{recipe.images[0] ? <Avatar variant="square" src={recipe.images[0].image_url} /> : <Avatar variant="square" sx={{ bgcolor: red[500] }}><DangerousIcon /></Avatar>}
									</ListItemAvatar>
									<ListItemText primary={recipe.name} secondary={``} />
									<ListItemIcon>
										{recipe.id === selectedRecipe?.id ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
									</ListItemIcon>
								</ListItemButton>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* Troisième colonne : Conteneur Marmiton */}
                <Grid item xs={6}>
                    <Paper elevation={3}>
                        <Typography variant="h6" sx={{textAlign: 'center'}}>{selectedRecipe?.name || 'Aucune recette sélectionnée'}</Typography>
						<Paper elevation={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
							<Button variant="contained" color="primary" sx={{marginRight: 1}} onClick={handleRandomRecipe}>
								Recette aléatoire
							</Button>
							<Button variant="contained" color="secondary" sx={{marginRight: 1}} onClick={handleOpenMarmiton}>
								Aller à Marmiton
							</Button>
							<Button variant="contained" color="primary" disabled={!selectedRecipe} onClick={handleAddRecipeToList}>
								Ajouter à la liste
							</Button>
						</Paper>
						{selectedRecipe && (
							<Paper elevation={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem', marginBottom: 0.5 }}>
								{/* Rating, difficulty, budget, total time designed with icons */}
								<Card sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0.5rem', marginRight: 1.5 }}>
									<StarRateIcon sx={{ marginRight: 1 }} />
									<Typography variant="body1" sx={{ marginRight: 1 }}>{selectedRecipe.rating}</Typography>
								</Card>
								<Card sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0.5rem', marginRight: 1.5 }}>
									<AccessAlarmIcon sx={{ marginRight: 1 }} />
									<Typography variant="body1" sx={{ marginRight: 1 }}>{translateTime(selectedRecipe.preparation_time, selectedRecipe.rest_time, selectedRecipe.cooking_time)}</Typography>
								</Card>
								<Card sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0.5rem', marginRight: 1.5 }}>
									<EuroIcon sx={{ marginRight: 1 }} />
									<Typography variant="body1" sx={{ marginRight: 1 }}>{translateCost(selectedRecipe.budget)}</Typography>
								</Card>
								<Card sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0.5rem' }}>
									<RamenDiningIcon sx={{ marginRight: 1 }} />
									<Typography variant="body1" sx={{ marginRight: 1 }}>{translateDifficulty(selectedRecipe.difficulty)}</Typography>
								</Card>
							</Paper>
						)}
                        <iframe src={marmitonUrl} title="Marmiton Recipe" style={{ width: '100%', height: '700px', border: 'none' }}></iframe>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

export default HomeScreen;
