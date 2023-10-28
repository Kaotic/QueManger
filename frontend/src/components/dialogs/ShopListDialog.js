import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api, { PROXY_IMAGE_URL } from "../../utils/api";
import { shopListIngredientToggle, shopListRemove } from "../../redux/actions/shopListActions";
import { translateIngredient, translateIngredientComplement } from "../../utils/translation";

function IngredientItem({ ingredient, userListId, isLoading = false }) {
	const dispatch = useDispatch();
	const shopList = useSelector((state) => state.shopList);
	const [isIngredientTaken, setIsIngredientTaken] = useState(false);

	useEffect(() => {
		const currentList = shopList.lists.find((list) => list.id === userListId);
		if(currentList){
			const currentIngredient = currentList.ingredients.find((ingredientInList) => ingredientInList.id === ingredient.id);
			if(currentIngredient){
				setIsIngredientTaken(currentIngredient.taken);
			}else{
				setIsIngredientTaken(false);
			}
		}else{
			setIsIngredientTaken(false);
		}
	}, [shopList, userListId, ingredient.id]);

	const handleIngredientTaken = () => {
		dispatch(shopListIngredientToggle(userListId, ingredient.id));
	}

	return (
		<ListItemButton disabled={isLoading} onClick={handleIngredientTaken}>
			<ListItemAvatar>
				{ingredient?.image_url ? <Avatar variant="square" src={PROXY_IMAGE_URL + ingredient.image_url} /> : <Avatar variant="square" sx={{ bgcolor: red[500] }}><DangerousIcon /></Avatar>}
			</ListItemAvatar>
			<ListItemText
				primary={translateIngredient(ingredient.name, ingredient?.quantity, ingredient?.unit_name)}
				secondary={translateIngredientComplement(ingredient?.complement)}
				sx={{ marginRight: 5 }}
			/>
			<ListItemIcon>
				{isIngredientTaken ? <CheckBoxIcon color="primary" /> : <CheckBoxOutlineBlankIcon />}
			</ListItemIcon>
		</ListItemButton>
	);
}

function ShopListDialog({ open, setOpen, userListId }) {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);
	const [isLoading, setIsLoading] = useState(false);
	const [ingredients, setIngredients] = useState([]);

	const handleClose = () => {
		setOpen(false);
	};

	const handleResetList = () => {
		dispatch(shopListRemove(userListId));
	};

	useEffect(() => {
		if (!userListId) {
			return;
		}

		setIsLoading(true);
		api.get(`/api/user/recipes/${userListId}/shop`, { headers: { Authorization: `Bearer ${user.auth.access}` } })
			.then((response) => {
				if (response.status === 200) {
					setIngredients(response.data);
				}
			})
			.catch((error) => {
				console.log(error);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [open, userListId]);

	return (
		<Dialog open={open} onClose={handleClose}>
			<DialogTitle>Liste de courses ({ingredients.length} ingrédients)</DialogTitle>
			<DialogContent>
				<List>
					{ingredients.map((ingredient, index) => (
						<IngredientItem key={index} ingredient={ingredient} userListId={userListId} isLoading={isLoading} />
					))}
				</List>
			</DialogContent>
			<DialogActions sx={{ justifyContent: 'space-between'}}>
				<Button color="error" onClick={handleResetList}>Réinitialiser</Button>
				<Button onClick={handleClose}>Fermer</Button>
			</DialogActions>
		</Dialog>
	);
}

export default ShopListDialog;