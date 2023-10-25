import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import api, { API_URL, PROXY_IMAGE_URL } from '../utils/api';
import { Grid, Button, Paper, List, ListItemButton, Avatar, ListItemText, ListItemAvatar, ListItemIcon, Card, Box, ButtonGroup, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import DangerousIcon from '@mui/icons-material/Dangerous';
import StarRateIcon from '@mui/icons-material/StarRate';
import EuroIcon from '@mui/icons-material/Euro';
import RamenDiningIcon from '@mui/icons-material/RamenDining';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LaunchIcon from '@mui/icons-material/Launch';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import moment from 'moment/moment';
import { red } from '@mui/material/colors';
import { translateCost, translateDifficulty, translateTime } from '../utils/translation';
import { useSnackbar } from 'notistack';

function HomeScreen() {
	const { enqueueSnackbar } = useSnackbar();
	const user = useSelector((state) => state.user);

	const [isLoading, setIsLoading] = React.useState(false);
	const [recipesList, setRecipesList] = React.useState([]);
	const [selectedList, setSelectedList] = React.useState([]);
	const [selectedRecipe, setSelectedRecipe] = React.useState(null);
	const [marmitonUrl, setMarmitonUrl] = React.useState('');

	const [removeListOpen, setRemoveListOpen] = React.useState(false);
	const [removeRecipeOpen, setRemoveRecipeOpen] = React.useState(false);

	const refreshLists = () => {
		setIsLoading(true);
		setSelectedList([]);
		setRecipesList([]);

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


	// First column actions
	const handleCreateList = () => {
		setIsLoading(true);
		api.get('/api/user/recipes/create', { headers: { Authorization: `Bearer ${user.auth.access}` } })
			.then((response) => {
				if(response.status === 200){
					refreshLists();
					enqueueSnackbar('Liste créée !', { variant: 'success' });
				}
			})
			.catch((error) => {
				console.log(error);
				setIsLoading(false);
			});
	};

	const handleRemoveList = () => {
		if(selectedList.length === 0){
			enqueueSnackbar('Aucune liste sélectionnée !', { variant: 'error' });
			setIsLoading(false);
			return;
		}

		setRemoveListOpen(true);
	};

	const handleRemoveListClose = () => {
		setRemoveListOpen(false);
	};

	const handleRemoveListConfirm = () => {
		setIsLoading(true);

		if(selectedList.length === 0){
			enqueueSnackbar('Aucune liste sélectionnée !', { variant: 'error' });
			setIsLoading(false);
			return;
		}

		api.get(`/api/user/recipes/${selectedList.id}/remove`, { headers: { Authorization: `Bearer ${user.auth.access}` } })
			.then((response) => {
				if(response.status === 200){
					refreshLists();
					setRemoveListOpen(false);
					enqueueSnackbar('Liste supprimée.', { variant: 'success' });
				}
			})
			.catch((error) => {
				console.log(error);
				setIsLoading(false);
				setRemoveListOpen(false);
				enqueueSnackbar('Une erreur est survenue lors de la suppression de la liste !', { variant: 'error' });
			});
	};

	const handleSelectRecipe = (recipe) => {
		setSelectedRecipe(recipe);
		if(recipe?.marmiton_url) {
			setMarmitonUrl(API_URL + 'api/marmiton/fetch?url=' + recipe.marmiton_url);
		}
	};


	// Second column actions
	const handleShopList = () => {
		if(selectedList.length === 0){
			enqueueSnackbar('Aucune liste sélectionnée !', { variant: 'error' });
			setIsLoading(false);
			return;
		}

		if(selectedList.recipes.length === 0){
			enqueueSnackbar('Aucune recette dans cette liste !', { variant: 'error' });
			setIsLoading(false);
			return;
		}
	};

	const handleRemoveRecipeFromList = () => {
		if(selectedList.length === 0){
			enqueueSnackbar('Aucune liste sélectionnée !', { variant: 'error' });
			setIsLoading(false);
			return;
		}

		if(!selectedRecipe){
			enqueueSnackbar('Aucune recette sélectionnée !', { variant: 'error' });
			setIsLoading(false);
			return;
		}

		if(selectedList.recipes.length === 0 || selectedList.recipes.filter((recipe) => recipe.id === selectedRecipe.id).length === 0){
			enqueueSnackbar('La recette n\'est pas dans la liste !', { variant: 'error' });
			setIsLoading(false);
			return;
		}

		setRemoveRecipeOpen(true);
	};

	const handleRemoveRecipeFromListClose = () => {
		setRemoveRecipeOpen(false);
	};

	const handleRemoveRecipeFromListConfirm = () => {
		setIsLoading(true);
		api.get(`/api/user/recipes/${selectedList.id}/remove/${selectedRecipe.marmiton_id}`, { headers: { Authorization: `Bearer ${user.auth.access}` } })
			.then((response) => {
				if(response.status === 200){
					setIsLoading(false);
					enqueueSnackbar('Recette supprimée de la liste.', { variant: 'success' });
					selectedList.recipes = selectedList.recipes.filter((recipe) => recipe.id !== selectedRecipe.id);
					setSelectedRecipe(null);
					setMarmitonUrl('');
					setRemoveRecipeOpen(false);
				}
			})
			.catch((error) => {
				console.log(error);
				setIsLoading(false);
				enqueueSnackbar('Une erreur est survenue lors de la suppression de la recette de la liste !', { variant: 'error' });
				setRemoveRecipeOpen(false);
			});
	};


	// Third column actions
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
                <Grid item xs={12} xl={3}>
					<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', '& > *': { m: 1 } }}>
						<ButtonGroup size="small" color="primary" aria-label="Contrôles de Marmiton">
							<Button variant="outlined" disabled={isLoading} onClick={handleCreateList} endIcon={<AddCircleOutlineIcon />}>
								Créer une liste
							</Button>
							<Button variant="outlined" color="error" disabled={isLoading} onClick={handleRemoveList} endIcon={<DeleteForeverIcon />}>
								Supprimer la liste
							</Button>
						</ButtonGroup>
					</Box>
                    <Paper elevation={3}>
                        <Typography variant="h6" sx={{ textAlign: 'center', paddingTop: 1 }}>Listes de recettes</Typography>
                        <List>
                            {recipesList.map((list, index) => (
                                <ListItemButton disabled={isLoading} onClick={() => setSelectedList(list)} key={index}>
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
                <Grid item xs={12} lg={6} xl={4}>
					<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', '& > *': { m: 1 } }}>
						<ButtonGroup size="small" color="primary" aria-label="Contrôles des recettes">
							<Button variant="outlined" disabled={isLoading} onClick={handleShopList} endIcon={<ShoppingCartCheckoutIcon />}>
								Liste de courses
							</Button>
							<Button variant="outlined" color="error" disabled={isLoading} onClick={handleRemoveRecipeFromList} endIcon={<DeleteForeverIcon />}>
								Supprimer la recette
							</Button>
						</ButtonGroup>
					</Box>
                    <Paper elevation={3}>
                        <Typography variant="h6" sx={{ textAlign: 'center', paddingTop: 1 }}>Recettes dans la liste</Typography>
                        <List>
                            {selectedList.recipes?.map((recipe, index) => (
                                <ListItemButton disabled={isLoading} onClick={() => handleSelectRecipe(recipe)} key={index}>
									<ListItemAvatar>
										{recipe.images[0]?.image_url ? <Avatar variant="square" src={PROXY_IMAGE_URL + recipe.images[0].image_url} /> : <Avatar variant="square" sx={{ bgcolor: red[500] }}><DangerousIcon /></Avatar>}
									</ListItemAvatar>
									<ListItemText
										primary={recipe.name}
										secondary={
											<React.Fragment>
												<span><StarRateIcon sx={{ height: 12, width: 12, marginRight: 0.25 }} />{recipe.rating}</span>
												<span> | </span>
												<span><AccessAlarmIcon sx={{ height: 12, width: 12, marginRight: 0.25 }} />{translateTime(recipe.preparation_time, recipe.rest_time, recipe.cooking_time)}</span>
												<span> | </span>
												<span><EuroIcon sx={{ height: 12, width: 12, marginRight: 0.25 }} />{translateCost(recipe.budget)}</span>
												<span> | </span>
												<span><RamenDiningIcon sx={{ height: 12, width: 12, marginRight: 0.25 }} />{translateDifficulty(recipe.difficulty)}</span>
											</React.Fragment>
										}
									/>
									<ListItemIcon>
										{recipe.id === selectedRecipe?.id ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
									</ListItemIcon>
								</ListItemButton>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* Troisième colonne : Conteneur Marmiton */}
                <Grid item xs={12} lg={6} xl={5}>
					<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', '& > *': { m: 1 } }}>
						<ButtonGroup size="small" color="primary" aria-label="Contrôles de Marmiton">
							<Button variant="outlined" disabled={isLoading} onClick={handleRandomRecipe} endIcon={<AutorenewIcon />}>
								Recette aléatoire
							</Button>
							<Button variant="outlined" disabled={isLoading} onClick={handleOpenMarmiton} endIcon={<LaunchIcon />}>
								Aller sur Marmiton
							</Button>
							<Button variant="outlined" disabled={isLoading} onClick={handleAddRecipeToList} endIcon={<AddCircleOutlineIcon />}>
								Ajouter à la liste
							</Button>
						</ButtonGroup>
					</Box>
                    <Paper elevation={3}>
						<div style={{ justifyContent: 'center', alignItems: 'center' }}>
							<Typography variant="h6" sx={{ textAlign: 'center', paddingTop: 1 }}>{selectedRecipe?.name || 'Aucune recette sélectionnée'}</Typography>
							{selectedRecipe && (
								<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem', marginBottom: 0.5 }}>
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
								</div>
							)}
						</div>
                        <iframe src={marmitonUrl} title="Marmiton Recipe" style={{ width: '100%', height: '700px', border: 'none' }}></iframe>
                    </Paper>
                </Grid>
            </Grid>
			<div>
				<Dialog open={removeListOpen} onClose={handleRemoveListClose}>
					<DialogTitle>Suppression de la liste</DialogTitle>
					<DialogContent>
						{selectedList.length > 0 && (
							<DialogContentText>
								Voulez-vous vraiment supprimer la liste "Semaine {selectedList.date_week} ({moment(selectedList.date_created).format('DD/MM/YYYY')})" ? Cette action est irréversible !
							</DialogContentText>
						)}
					</DialogContent>
					<DialogActions>
						<Button onClick={handleRemoveListClose} disabled={isLoading}>Annuler</Button>
						<Button onClick={handleRemoveListConfirm} color="error" disabled={isLoading}>Confirmer la suppression</Button>
					</DialogActions>
				</Dialog>
				<Dialog open={removeRecipeOpen} onClose={handleRemoveRecipeFromListClose}>
					<DialogTitle>Suppression de la recette</DialogTitle>
					<DialogContent>
						{selectedRecipe && (
							<DialogContentText>
								Voulez-vous vraiment supprimer la recette "{selectedRecipe.name}" de la liste actuelle ? Cette action est irréversible !
							</DialogContentText>
						)}
					</DialogContent>
					<DialogActions>
						<Button onClick={handleRemoveRecipeFromListClose} disabled={isLoading}>Annuler</Button>
						<Button onClick={handleRemoveRecipeFromListConfirm} color="error" disabled={isLoading}>Confirmer la suppression</Button>
					</DialogActions>
				</Dialog>
			</div>
        </Container>
    );
}

export default HomeScreen;
