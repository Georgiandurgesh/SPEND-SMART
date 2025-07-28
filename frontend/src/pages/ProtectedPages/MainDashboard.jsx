import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "../../components/Chart";
import { useSelector } from "react-redux";
import moment from "moment";
import { toast } from "react-toastify";
import { useGetAllIncomesQuery } from "../../features/api/apiSlices/incomeApiSlice";
import { useGetAllExpensesQuery } from "../../features/api/apiSlices/expenseApiSlice";
import { Income, Expense, Balance } from "../../utils/Icons";
import { NumericFormat } from "react-number-format";
import { utils, writeFile } from 'xlsx';

const DashboardPage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user.username);
  
  const handleViewAllTransactions = () => {
    navigate('/dashboard/transactions');
  };

  const [totalBalance, setTotalBalance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [recentHistory, setRecentHistory] = useState([]);
  const [chartData, setChartData] = useState([
    {
      name: "Loading...",
      income: 0,
      expense: 0,
    },
  ]);

  const handleExportToExcel = async () => {
    try {
      // Show loading state
      toast.info('Preparing your export...', { autoClose: 2000 });
      
      // Ensure we have the latest data
      let incomes = [];
      let expenses = [];
      
      try {
        // Log the current state before fetching
        console.log('Current incomeData:', incomeData);
        console.log('Current expenseData:', expenseData);
        
        // Fetch fresh data using the query hooks
        console.log('Fetching fresh data...');
        const [incomesResult, expensesResult] = await Promise.all([
          refetchIncomes().unwrap(),
          refetchExpenses().unwrap()
        ]);
        
        // Log the raw API responses
        console.log('Incomes API response:', JSON.stringify(incomesResult, null, 2));
        console.log('Expenses API response:', JSON.stringify(expensesResult, null, 2));
        
        // Extract data from the response
        // The API returns { message: string, incomes: [], totalIncome: number } for incomes
        // and { message: string, expenses: [], totalExpense: number } for expenses
        if (incomesResult?.incomes && Array.isArray(incomesResult.incomes)) {
          incomes = incomesResult.incomes;
        } else if (incomesResult?.data?.incomes && Array.isArray(incomesResult.data.incomes)) {
          incomes = incomesResult.data.incomes;
        } else if (Array.isArray(incomesResult)) {
          incomes = incomesResult;
        } else if (Array.isArray(incomesResult?.data)) {
          incomes = incomesResult.data;
        }
        
        if (expensesResult?.expenses && Array.isArray(expensesResult.expenses)) {
          expenses = expensesResult.expenses;
        } else if (expensesResult?.data?.expenses && Array.isArray(expensesResult.data.expenses)) {
          expenses = expensesResult.data.expenses;
        } else if (Array.isArray(expensesResult)) {
          expenses = expensesResult;
        } else if (Array.isArray(expensesResult?.data)) {
          expenses = expensesResult.data;
        }
        
        // If we still don't have data, try to use the cached data from Redux
        if ((!incomes || incomes.length === 0) && incomeData) {
          console.log('Falling back to cached income data');
          const cachedData = incomeData.incomes || incomeData.data?.incomes || incomeData.data || incomeData;
          if (Array.isArray(cachedData)) {
            incomes = cachedData;
          } else if (cachedData?.data && Array.isArray(cachedData.data)) {
            incomes = cachedData.data;
          }
        }
        
        if ((!expenses || expenses.length === 0) && expenseData) {
          console.log('Falling back to cached expense data');
          const cachedData = expenseData.expenses || expenseData.data?.expenses || expenseData.data || expenseData;
          if (Array.isArray(cachedData)) {
            expenses = cachedData;
          } else if (cachedData?.data && Array.isArray(cachedData.data)) {
            expenses = cachedData.data;
          }
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to existing data if refetch fails
        const fallbackIncomes = incomeData?.incomes || incomeData?.data?.incomes || incomeData?.data || incomeData || [];
        const fallbackExpenses = expenseData?.expenses || expenseData?.data?.expenses || expenseData?.data || expenseData || [];
        
        incomes = Array.isArray(fallbackIncomes) ? fallbackIncomes : [];
        expenses = Array.isArray(fallbackExpenses) ? fallbackExpenses : [];
      }
      
      console.log('Final incomes to export:', JSON.stringify(incomes, null, 2));
      console.log('Final expenses to export:', JSON.stringify(expenses, null, 2));
      
      if (!Array.isArray(incomes) || !Array.isArray(expenses)) {
        console.error('Invalid data format after all attempts:', { 
          incomesType: typeof incomes, 
          expensesType: typeof expenses,
          incomes,
          expenses
        });
        toast.error('Failed to prepare data for export');
        return;
      }

      // Prepare data for export
      const headerRow = {
        'Type': 'Type',
        'Amount': 'Amount',
        'Category': 'Category',
        'Date': 'Date',
        'Description': 'Description',
        'Transaction ID': 'Transaction ID'
      };

      // Process incomes
      const incomeRows = [];
      const expenseRows = [];
      
      // Helper function to process a single transaction
      const processTransaction = (item, type, index) => {
        try {
          // Skip if item is null or undefined
          if (item == null) {
            console.warn(`Skipping ${type} at index ${index}: item is ${item}`);
            return null;
          }
          
          // Handle different possible property names with fallbacks
          const amount = item.amount || item.amountValue || 0;
          const category = item.category || item.categoryName || item.categoryId || 'Uncategorized';
          const date = item.date ? new Date(item.date) : new Date();
          const description = item.description || item.note || item.details || '';
          const id = item._id || item.id || `${type.toLowerCase()}-${index}`;
          
          // Format the amount based on transaction type
          let formattedAmount = Number(amount);
          if (isNaN(formattedAmount)) {
            console.warn(`Invalid amount for ${type} ${id}:`, amount);
            formattedAmount = 0;
          }
          
          // Ensure expenses are negative
          if (type === 'Expense') {
            formattedAmount = -Math.abs(formattedAmount);
          }
          
          // Create the row
          const row = {
            'Type': type,
            'Amount': formattedAmount.toFixed(2),
            'Category': String(category),
            'Date': date.toLocaleDateString(),
            'Description': String(description).substring(0, 255), // Limit description length
            'Transaction ID': String(id)
          };
          
          console.log(`Processed ${type} row ${index + 1}:`, row);
          return row;
          
        } catch (error) {
          console.error(`Error processing ${type} at index ${index}:`, error);
          console.error('Problematic item:', item);
          return null;
        }
      };
      
      // Process incomes
      if (incomes && Array.isArray(incomes)) {
        console.log(`Processing ${incomes.length} incomes`);
        incomes.forEach((income, index) => {
          const row = processTransaction(income, 'Income', index);
          if (row) incomeRows.push(row);
        });
      } else {
        console.warn('No incomes array found or invalid format:', incomes);
      }

      // Process expenses
      if (expenses && Array.isArray(expenses)) {
        console.log(`Processing ${expenses.length} expenses`);
        expenses.forEach((expense, index) => {
          const row = processTransaction(expense, 'Expense', index);
          if (row) expenseRows.push(row);
        });
      } else {
        console.warn('No expenses array found or invalid format:', expenses);
      }

      // Combine all data
      const data = [headerRow, ...incomeRows, ...expenseRows];
      console.log('Final data to export:', data);

      if (data.length <= 1) {
        const errorData = { 
          incomes: incomes || 'No incomes', 
          expenses: expenses || 'No expenses',
          incomeCount: Array.isArray(incomes) ? incomes.length : 0,
          expenseCount: Array.isArray(expenses) ? expenses.length : 0,
          incomeType: incomes ? typeof incomes : 'undefined',
          expenseType: expenses ? typeof expenses : 'undefined',
          incomeSample: Array.isArray(incomes) && incomes.length > 0 ? incomes[0] : 'N/A',
          expenseSample: Array.isArray(expenses) && expenses.length > 0 ? expenses[0] : 'N/A'
        };
        console.error('No valid transactions found to export. Data:', errorData);
        toast.warning('No valid transactions found to export');
        return;
      }

      try {
        // Create a new workbook
        const wb = utils.book_new();
        
        // Convert data to worksheet (skip header row as we'll add it manually)
        const ws = utils.json_to_sheet(data.slice(1), { 
          header: Object.keys(headerRow),
          skipHeader: true
        });
        
        // Add the header row with proper formatting
        utils.sheet_add_aoa(ws, [[
          'Type', 'Amount', 'Category', 'Date', 'Description', 'Transaction ID'
        ]], { origin: 'A1' });
        
        // Set column widths for better readability
        const columnWidths = [
          { wch: 10 }, // Type
          { wch: 15 }, // Amount
          { wch: 20 }, // Category
          { wch: 15 }, // Date
          { wch: 40 }, // Description
          { wch: 36 }  // Transaction ID (for UUIDs)
        ];
        ws['!cols'] = columnWidths;
        
        // Add the worksheet to the workbook
        utils.book_append_sheet(wb, ws, 'Transactions');
        
        // Generate a filename with the current date
        const today = new Date();
        const dateString = today.toISOString().split('T')[0];
        const fileName = `spend-smart-export-${dateString}.xlsx`;
        
        // Save the file
        writeFile(wb, fileName);
        
        // Show success message with the number of transactions exported
        const totalTransactions = data.length - 1; // Subtract 1 for header row
        toast.success(`Successfully exported ${totalTransactions} transactions!`, { 
          autoClose: 3000,
          closeButton: true
        });
        
        console.log('Export completed successfully');
        
      } catch (error) {
        console.error('Error during Excel file creation:', error);
        toast.error('Failed to create Excel file. Please try again.', {
          autoClose: 5000,
          closeButton: true
        });
        return; // Exit the function if Excel creation fails
      }
    } catch (error) {
      console.error('Export failed:', error);
      
      // More detailed error message based on error type
      let errorMessage = 'Failed to export data. Please try again.';
      
      if (error.message) {
        if (error.message.includes('Network Error')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Request timed out. Please try again later.';
        } else if (error.message.includes('401') || error.message.includes('403')) {
          errorMessage = 'Authentication error. Please log in again.';
        }
      }
      
      toast.error(errorMessage, {
        autoClose: 5000,
        closeButton: true
      });
      
      // Log additional debug info
      console.error('Export error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
    }
  };

  const { data: incomeData, refetch: refetchIncomes } = useGetAllIncomesQuery();
  const { data: expenseData, refetch: refetchExpenses } =
    useGetAllExpensesQuery();

  const fetchData = useCallback(async () => {
    try {
      await refetchIncomes();
      await refetchExpenses();
      
      if (incomeData) {
        setTotalIncome(incomeData?.totalIncome);
      }
      if (expenseData) {
        setTotalExpense(expenseData?.totalExpense);
      }
      setTotalBalance(incomeData?.totalIncome - expenseData?.totalExpense);

      // Combine and sort recent transactions
      const combined = [
        ...(incomeData?.incomes?.map((income) => ({
          ...income,
          type: 'income',
          amount: Math.abs(income.amount),
        })) || []),
        ...(expenseData?.expenses?.map((expense) => ({
          ...expense,
          type: 'expense',
          amount: -Math.abs(expense.amount),
        })) || []),
      ].sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

      setRecentHistory(combined);

      // Process monthly data
      const monthlyData = {};
      
      // Process incomes by month
      incomeData?.incomes?.forEach(income => {
        const monthYear = moment(income.date).format('MMM YYYY');
        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = { income: 0, expense: 0 };
        }
        monthlyData[monthYear].income += parseFloat(income.amount) || 0;
      });
      
      // Process expenses by month
      expenseData?.expenses?.forEach(expense => {
        const monthYear = moment(expense.date).format('MMM YYYY');
        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = { income: 0, expense: 0 };
        }
        monthlyData[monthYear].expense += parseFloat(expense.amount) || 0;
      });

      // Convert to array and sort by date
      const sortedMonths = Object.entries(monthlyData)
        .map(([monthYear, data]) => ({
          name: monthYear,
          income: data.income,
          expense: data.expense,
          date: moment(monthYear, 'MMM YYYY').toDate()
        }))
        .sort((a, b) => a.date - b.date);

      // Get last 6 months
      const lastSixMonths = sortedMonths.slice(-6);
      
      setChartData(lastSixMonths.length > 0 ? lastSixMonths : [
        {
          name: "No data available",
          income: 0,
          expense: 0,
        }
      ]);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
      setChartData([
        {
          name: "Error loading data",
          income: 0,
          expense: 0,
        }
      ]);
    }
  }, [incomeData, expenseData, refetchIncomes, refetchExpenses]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <section className="w-full min-h-screen gradient-surface relative overflow-y-auto px-6 md:px-8 py-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-64 h-64 gradient-primary rounded-full opacity-5 blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 gradient-secondary rounded-full opacity-5 blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 gradient-accent rounded-full opacity-5 blur-2xl animate-float" style={{animationDelay: '6s'}}></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Enhanced Header Section */}
        <div className="mb-12 animate-fade-in">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 gradient-primary rounded-2xl flex items-center justify-center animate-glow">
                  <span className="text-2xl">👋</span>
                </div>
                <div className="glass px-4 py-2 rounded-full">
                  <span className="text-sm font-medium text-violet-700">Financial Dashboard</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Welcome back,{" "}
                <span className="gradient-primary bg-clip-text text-transparent">{user}</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 font-medium max-w-2xl">
                Your financial command center is ready.{" "}
                <span className="gradient-secondary bg-clip-text text-transparent font-bold">
                  Let&apos;s get started!
                </span>
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="card-modern p-6 text-center min-w-[160px]">
                <div className="text-sm text-gray-500 mb-2">Today</div>
                <div className="text-2xl font-bold text-gray-900">
                  {new Date().toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long' 
                  })}
                </div>
              </div>
              
              <div className="card-modern p-6 text-center min-w-[160px] group hover:scale-105 transition-all duration-300">
                <div className="text-sm text-gray-500 mb-2">Export to Excel</div>
                <button 
                  onClick={() => handleExportToExcel()} 
                  className="w-12 h-12 bg-green-500 hover:bg-green-600 rounded-xl flex items-center justify-center mx-auto group-hover:animate-glow transition-colors"
                  title="Export to Excel"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </button>
                <div className="text-xs text-gray-400 mt-2">Download Data</div>
              </div>
            </div>
          </div>
        </div>
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Total Balance Card */}
          <div className="card-modern p-8 group hover:scale-105 transition-all duration-300 animate-slide-up relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 gradient-primary opacity-5 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center group-hover:animate-glow">
                  <Balance className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 font-medium mb-1">Net Worth</div>
                  <div className={`text-3xl md:text-4xl font-bold ${
                    totalBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    ₹<NumericFormat
                      value={totalBalance}
                      displayType={"text"}
                      thousandSeparator={true}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Financial Health</span>
                  <span className={`font-semibold ${
                    totalBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {totalBalance >= 0 ? 'Excellent' : 'Needs Attention'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-700 ${
                      totalBalance >= 0 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 'bg-gradient-to-r from-rose-400 to-rose-600'
                    }`}
                    style={{ width: totalBalance >= 0 ? '85%' : '35%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Total Income Card */}
          <div className="card-modern p-8 group hover:scale-105 transition-all duration-300 animate-slide-up relative overflow-hidden" style={{animationDelay: '0.1s'}}>
            <div className="absolute top-0 right-0 w-32 h-32 gradient-secondary opacity-5 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 gradient-secondary rounded-2xl flex items-center justify-center group-hover:animate-glow">
                  <Income className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 font-medium mb-1">Total Income</div>
                  <div className="text-3xl md:text-4xl font-bold text-emerald-600">
                    ₹<NumericFormat
                      value={totalIncome}
                      displayType={"text"}
                      thousandSeparator={true}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-emerald-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span>Growth Trend</span>
                </div>
                <span className="text-gray-600 font-medium">+12% this month</span>
              </div>
            </div>
          </div>

          {/* Total Expenses Card */}
          <div className="card-modern p-8 group hover:scale-105 transition-all duration-300 animate-slide-up relative overflow-hidden" style={{animationDelay: '0.2s'}}>
            <div className="absolute top-0 right-0 w-32 h-32 gradient-accent opacity-5 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 gradient-accent rounded-2xl flex items-center justify-center group-hover:animate-glow">
                  <Expense className="w-8 h-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 font-medium mb-1">Total Expenses</div>
                  <div className="text-3xl md:text-4xl font-bold text-rose-600">
                    ₹<NumericFormat
                      value={totalExpense}
                      displayType={"text"}
                      thousandSeparator={true}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-rose-600">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  <span>Spending Control</span>
                </div>
                <span className="text-gray-600 font-medium">-5% this month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Charts and Recent Transactions Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Activity Chart */}
          <div className="lg:col-span-2 card-modern p-8 animate-slide-up">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <div>
                  <h1 className="text-3xl font-bold">Welcome back, {user}!</h1>
                  <p className="text-gray-500">Here&apos;s what&apos;s happening with your money.</p>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">Financial Activity</h3>
                <p className="text-gray-600">Track your income and expenses over time</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center glass px-4 py-2 rounded-full">
                  <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">Income</span>
                </div>
                <div className="flex items-center glass px-4 py-2 rounded-full">
                  <div className="w-3 h-3 bg-gradient-to-r from-rose-400 to-rose-600 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">Expenses</span>
                </div>
              </div>
            </div>
            <div className="h-80 w-full relative">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-50/50 to-transparent rounded-2xl pointer-events-none"></div>
              <Chart data={chartData} />
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="card-modern p-8 animate-slide-up" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">Recent Activity</h3>
                <p className="text-sm text-gray-600">Latest financial transactions</p>
              </div>
              <button 
                onClick={handleViewAllTransactions}
                className="glass px-4 py-2 rounded-xl text-violet-600 hover:bg-violet-50 text-sm font-medium transition-all duration-200 hover:shadow-sm"
              >
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentHistory.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 gradient-surface rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl text-gray-400">📊</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">No transactions yet</h4>
                  <p className="text-gray-500 text-sm mb-4">Start tracking your finances today!</p>
                  <button className="btn-primary text-sm px-6 py-3">
                    Add Transaction
                  </button>
                </div>
              ) : (
                recentHistory.map((transaction, index) => (
                  <div
                    key={transaction.id}
                    className="group p-4 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-soft transition-all duration-300 animate-slide-up"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                          transaction.type === "income" 
                            ? "gradient-secondary" 
                            : "gradient-accent"
                        }`}>
                          {transaction.type === "income" ? (
                            <Income className="w-5 h-5 text-white" />
                          ) : (
                            <Expense className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 capitalize">
                            {transaction.title}
                          </h4>
                          <p className="text-sm text-gray-500 capitalize">
                            {transaction.category}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          transaction.type === "income"
                            ? "text-emerald-600"
                            : "text-rose-600"
                        }`}>
                          {transaction.type === "income" ? "+" : "-"}₹{transaction.amount}
                        </div>
                        <div className="text-xs text-gray-400">
                          {moment(transaction.date).format('MMM DD, YYYY')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
