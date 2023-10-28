import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

function AboutDialog({ open, setOpen }) {
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>A propos ?</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <b>QueManger</b> est la solution à tous vos dilemmes culinaires !<br /><br />
                    Vous êtes-vous déjà demandé ce que vous alliez manger ce soir ? Ou bien avez-vous déjà oublié un ingrédient crucial pendant vos courses ?<br /><br />
                    Avec <b>QueManger</b>, ces problèmes appartiennent désormais au passé.<br />
                    Notre application vous offre la possibilité de créer une liste de recettes basée sur vos préférences, des filtres spécifiques, ou même de manière totalement aléatoire pour chaque semaine.<br /><br />
                    À la fin, <b>QueManger</b> vous génère une liste de courses complète pour toute la semaine, garantissant que vous ne manquiez plus jamais d'un ingrédient.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Fermer</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AboutDialog;