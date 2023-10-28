import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api, { PROXY_IMAGE_URL } from "../../utils/api";

function ShopListDialog({ open, setOpen, userRecipeId }) {
	const user = useSelector((state) => state.user);
	const [isLoading, setIsLoading] = useState(false);

	const [ingredients, setIngredients] = useState([]);

	const handleClose = () => {
		setOpen(false);
	};

	const handleIngredientTaken = (index) => {
		const newIngredients = [...ingredients];
		newIngredients[index].taken = !newIngredients[index].taken;
		setIngredients(newIngredients);
	};

	useEffect(() => {
		if (!userRecipeId) {
			return;
		}

		setIsLoading(true);
		api.get(`/api/user/recipes/${userRecipeId}/shop`, { headers: { Authorization: `Bearer ${user.auth.access}` } })
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
	}, [userRecipeId]);

	function translateIngredient(name, quantity, unit_name) {
		let translation = name;

		if (quantity) {
			translation += ` (${unit_name ? '' : 'x'}${quantity}${unit_name ? ' ' + unit_name : ''})`;
		}

		return translation;
	}

	function translateIngredientComplement(complement) {
		if (!complement) {
			return '';
		}

		if (complement.startsWith('(') && complement.endsWith(')')) {
			complement = complement.substring(1, complement.length - 1);
		}

		if (complement.startsWith('"') && complement.endsWith('"')) {
			complement = complement.substring(1, complement.length - 1);
		}

		return complement;
	}

	return (
		<Dialog open={open} onClose={handleClose}>
			<DialogTitle>Liste de courses ({ingredients.length} ingrédients)</DialogTitle>
			<DialogContent>
				<List>
					{ingredients.map((ingredient, index) => (
						<ListItemButton disabled={isLoading} onClick={() => handleIngredientTaken(index)} key={index}>
							<ListItemAvatar>
								{ingredient?.image_url ? <Avatar variant="square" src={PROXY_IMAGE_URL + ingredient.image_url} /> : <Avatar variant="square" sx={{ bgcolor: red[500] }}><DangerousIcon /></Avatar>}
							</ListItemAvatar>
							<ListItemText
								primary={translateIngredient(ingredient?.name, ingredient?.quantity, ingredient?.unit_name)}
								secondary={translateIngredientComplement(ingredient?.complement)}
							/>
							<ListItemIcon>
								{ingredient?.taken ? <CheckBoxIcon color="primary" /> : <CheckBoxOutlineBlankIcon />}
							</ListItemIcon>
						</ListItemButton>
					))}
				</List>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Fermer</Button>
			</DialogActions>
		</Dialog>
	);
}

export default ShopListDialog;