import React, { useState, FormEvent } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

interface Product {
  product_id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Transaction {
  id: string;
  createdAt: string;
  description: string;
  amount: number;
  status: string;
  products: Product[];
}

interface ApiResponse {
  data: Transaction[];
}

const MyTransactionsPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'succeeded' | 'failed'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  // Function to fetch transactions from the API
  const handleFetchTransactions = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) {
      setError("Please enter an email address.");
      setStatus('failed'); // Set status to failed to show the error
      return;
    }

    setStatus('loading'); // Set status to loading
    setError(null); // Set error status to null
    setTransactions([]); // Clear previous transactions
    setHasSearched(true); // Mark that a search attempt has been made

    const apiUrl = `${API_URL}/v1/transactions/${email}`;

    try {
      console.log(`Getting transactions from: ${apiUrl}`);
      const response = await fetch(apiUrl);

      
      if (!response.ok) {
        let errorBody = 'Failed to fetch transactions.';
        try {
            const errorData = await response.json();
            errorBody = errorData.message || errorBody; // Use server message if available
        } catch {
            // Ignore if response body isn't valid JSON
        }
        throw new Error(`HTTP error! status: ${response.status} - ${errorBody}`);
      }

      const responseData: ApiResponse = await response.json();

      const fetchedTransactions = responseData.data || [];

      setTransactions(fetchedTransactions);
      setStatus('succeeded');

    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'An unknown error occurred while fetching transactions.';
        console.error("Failed to fetch transactions:", err);
        setError(message);
        setStatus('failed');
    }
  };

  // Function to render the content based on status
  const renderContent = () => {
    if (status === 'loading') {
      return (
        <div className="space-y-4 mt-6">
          {/* Skeleton for Table */}
          <Skeleton className="h-10 w-full" /> {/* Header row */}
          {[...Array(4)].map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" /> /* Data rows */
          ))}
        </div>
      );
    }

    if (status === 'failed' && error) {
      return (
        <Alert variant="destructive" className="mt-6">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }

    if (status === 'succeeded') {
      if (transactions.length > 0) {
        return (
          <Card className="mt-6">
             <CardHeader>
               <CardTitle>Your Transactions</CardTitle>
               <CardDescription>Showing transactions associated with {email}</CardDescription>
             </CardHeader>
             <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="font-medium">{tx.id}</TableCell>
                        <TableCell>{new Date(tx.createdAt).toLocaleDateString()}</TableCell> {/* Date formatting */}
                        {/* List all products for this transaction */}
                        <TableCell>
                          {tx.products.map((product, index) => (
                            <div key={product.product_id}>
                              {product.quantity} x {product.name}
                              {index < tx.products.length - 1 && <br />} {/* Add line breaks between each product */}
                            </div>
                          ))}
                        </TableCell>
                        <TableCell>{tx.status}</TableCell>
                        <TableCell className={`text-right ${tx.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {tx.amount.toLocaleString(undefined, { style: 'currency', currency: 'COP' })} {/* Format as currency */}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
             </CardContent>
          </Card>
        );
      } else {
        // Only show "No transactions found" if a search was actually performed
        return hasSearched ? (
             <Alert className="mt-6">
                <Terminal className="h-4 w-4" />
                <AlertTitle>No Results</AlertTitle>
                <AlertDescription>No transactions found for the email address: {email}</AlertDescription>
             </Alert>
        ) : null; // Don't show anything before the first search
      }
    }

    // Initial state ('idle') or after a successful search with no results (handled above)
    return null;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 py-8 flex-1">

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>My Transactions</CardTitle>
            <CardDescription>
              Enter your email address below to view your transaction history.
              This allows you to track your purchases, subscriptions, and refunds.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search Form */}
            <form onSubmit={handleFetchTransactions} className="flex flex-col sm:flex-row gap-4 items-end">
              <div className='flex-grow'>
                <label htmlFor="email-input" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Email Address
                </label>
                <Input
                  id="email-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                  disabled={status === 'loading'}
                />
              </div>
              <Button type="submit" disabled={status === 'loading'}>
                {status === 'loading' ? 'Searching...' : 'Search Transactions'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Main Content Area for Results */}
        <main className="flex-1">
           {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default MyTransactionsPage;