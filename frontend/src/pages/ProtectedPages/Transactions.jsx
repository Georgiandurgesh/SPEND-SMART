import { useState } from 'react';
import { useGetAllIncomesQuery } from '../../features/api/apiSlices/incomeApiSlice';
import { useGetAllExpensesQuery } from '../../features/api/apiSlices/expenseApiSlice';
import { Income, Expense } from '../../utils/Icons';
import moment from 'moment';
import { NumericFormat } from 'react-number-format';

const Transactions = () => {
  const [activeTab, setActiveTab] = useState('all');
  const { data: incomesData } = useGetAllIncomesQuery();
  const { data: expensesData } = useGetAllExpensesQuery();
  
  // Combine and sort transactions by date
  const allTransactions = [
    ...(incomesData?.incomes?.map(income => ({
      ...income,
      type: 'income',
      amount: Math.abs(income.amount)
    })) || []),
    ...(expensesData?.expenses?.map(expense => ({
      ...expense,
      type: 'expense',
      amount: -Math.abs(expense.amount)
    })) || [])
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Filter transactions based on active tab
  const filteredTransactions = activeTab === 'all' 
    ? allTransactions 
    : allTransactions.filter(tx => tx.type === activeTab);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Transactions</h1>
          <p className="text-gray-600">View and manage your financial transactions</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
            activeTab === 'all' 
              ? 'text-violet-600 border-b-2 border-violet-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          All Transactions
        </button>
        <button
          onClick={() => setActiveTab('income')}
          className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
            activeTab === 'income' 
              ? 'text-emerald-600 border-b-2 border-emerald-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Incomes
        </button>
        <button
          onClick={() => setActiveTab('expense')}
          className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
            activeTab === 'expense' 
              ? 'text-rose-600 border-b-2 border-rose-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Expenses
        </button>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredTransactions.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredTransactions.map((transaction) => (
              <div 
                key={`${transaction.type}-${transaction._id}`}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      transaction.type === 'income' 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'bg-rose-50 text-rose-600'
                    }`}>
                      {transaction.type === 'income' ? (
                        <Income className="w-5 h-5" />
                      ) : (
                        <Expense className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 capitalize">
                        {transaction.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {transaction.category} • {moment(transaction.date).format('MMM D, YYYY')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      ₹<NumericFormat
                        value={Math.abs(transaction.amount)}
                        displayType="text"
                        thousandSeparator={true}
                      />
                    </p>
                    <p className="text-xs text-gray-400">
                      {transaction.type === 'income' ? 'Income' : 'Expense'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl text-gray-400">📊</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">No transactions found</h4>
            <p className="text-gray-500 text-sm">
              {activeTab === 'all' 
                ? 'You don\'t have any transactions yet.' 
                : `You don't have any ${activeTab}s yet.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
