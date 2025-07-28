import PropTypes from 'prop-types';
import { Button } from '@nextui-org/react';
import { FaFileExport } from 'react-icons/fa';
import { useExportTransactionsMutation } from '../features/api/exportApi';
import { toast } from 'react-toastify';

const ExportButton = ({ className = '', variant = 'solid', color = 'primary' }) => {
  const [exportTransactions, { isLoading }] = useExportTransactionsMutation();

  const handleExport = async () => {
    try {
      const { data } = await exportTransactions().unwrap();
      
      if (data && data.blob) {
        // Create a download link and trigger the download
        const url = window.URL.createObjectURL(data.blob);
        const a = document.createElement('a');
        
        a.href = url;
        a.download = data.filename || 'transactions.xlsx';
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast.success('Export completed successfully!');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Export error:', error);
      let errorMessage = 'Failed to export transactions. Please try again.';
      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
      } else if (error?.status === 403) {
        errorMessage = 'Access denied. Please check your permissions.';
      }
      toast.error(errorMessage);
    }
  };

  return (
    <Button
      color={color}
      variant={variant}
      onPress={handleExport}
      isLoading={isLoading}
      startContent={!isLoading && <FaFileExport />}
      className={className}
    >
      {isLoading ? 'Exporting...' : 'Export to Excel'}
    </Button>
  );
};

ExportButton.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.string,
  color: PropTypes.string,
};

ExportButton.defaultProps = {
  className: '',
  variant: 'solid',
  color: 'primary',
};

export default ExportButton;
