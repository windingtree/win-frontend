import { Dialog, DialogContent, SxProps } from '@mui/material';
import { SearchFilterForm } from './SearchFilterForm';

interface SearchFilterDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const dialogPaperProps: SxProps = {
  sx: {
    position: 'absolute',
    top: '20%'
  }
};

export const SearchFilterDialog = ({ open, setOpen }: SearchFilterDialogProps) => {
  const handleCloseDialog = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} PaperProps={dialogPaperProps} onClose={handleCloseDialog}>
      <DialogContent>
        <SearchFilterForm
          onCloseClick={handleCloseDialog}
          onSubmitClick={handleCloseDialog}
        />
      </DialogContent>
    </Dialog>
  );
};
