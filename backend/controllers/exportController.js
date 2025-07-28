import Income from '../models/incomeModel.js';
import Expense from '../models/expenseModel.js';
import XLSX from 'xlsx';
import asyncHandler from 'express-async-handler';

// @desc    Export all transactions to Excel
// @route   GET /api/export/transactions
// @access  Private
export const exportTransactions = asyncHandler(async (req, res) => {
  try {
    // Get user ID from the authenticated request
    const userId = req.user._id;

    // Fetch all incomes and expenses for the user
    const [incomes, expenses] = await Promise.all([
      Income.find({ user: userId }).sort({ date: -1 }),
      Expense.find({ user: userId }).sort({ date: -1 })
    ]);

    // Format incomes data
    const formattedIncomes = incomes.map(income => ({
      'Type': 'Income',
      'Title': income.title,
      'Amount': income.amount,
      'Category': income.category,
      'Date': new Date(income.date).toLocaleDateString(),
      'Description': income.description || ''
    }));

    // Format expenses data
    const formattedExpenses = expenses.map(expense => ({
      'Type': 'Expense',
      'Title': expense.title,
      'Amount': -expense.amount, // Negative for expenses
      'Category': expense.category,
      'Date': new Date(expense.date).toLocaleDateString(),
      'Description': expense.description || ''
    }));

    // Combine and sort all transactions by date
    const allTransactions = [...formattedIncomes, ...formattedExpenses]
      .sort((a, b) => new Date(b.Date) - new Date(a.Date));

    // Create a new workbook and add worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(allTransactions);
    
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');

    // Generate filename with current date
    const date = new Date().toISOString().split('T')[0];
    const filename = `transactions_${date}.xlsx`;
    
    // Set headers for file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Send the Excel file
    res.end(XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' }));

  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ message: 'Error exporting transactions' });
  }
});
