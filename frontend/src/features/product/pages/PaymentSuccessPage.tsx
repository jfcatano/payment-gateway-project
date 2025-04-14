import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, AlertTriangle, Clock, Loader2 } from "lucide-react";

interface PaymentGatewayPaymentMethod {
    type: string;
    extra: {
        name?: string;
        brand?: string;
        card_type?: string;
        last_four?: string;
        is_three_ds?: boolean;
        three_ds_auth_type?: string | null;
    } | null;
    installments?: number;
}

interface PaymentGatewayTransactionData {
    id: string;
    created_at: string;
    finalized_at: string | null;
    amount_in_cents: number;
    reference: string;
    currency: string;
    payment_method_type: string;
    payment_method: PaymentGatewayPaymentMethod;
    status: 'APPROVED' | 'DECLINED' | 'ERROR' | 'PENDING' | 'VOIDED';
    status_message: string | null;
}

const PaymentSuccessPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [transactionDetails, setTransactionDetails] = useState<PaymentGatewayTransactionData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [paymentGatewayTransactionId, setPaymentGatewayTransactionId] = useState<string | null>(null);

    const PAYMENT_GATEWAY_API_URL = import.meta.env.VITE_PAYMENT_GATEWAY_API_URL;

    useEffect(() => {
        const txIdFromUrl = searchParams.get('id');
        setPaymentGatewayTransactionId(txIdFromUrl);

        if (!txIdFromUrl) {
            setError("No transaction ID found in the URL.");
            setIsLoading(false);
            return;
        }

        const fetchTransactionDetails = async () => {
            setIsLoading(true);
            setError(null);
            setTransactionDetails(null);

            const apiUrl = `${PAYMENT_GATEWAY_API_URL}/transactions/${txIdFromUrl}`;

            try {
                console.log(`Fetching details from: ${apiUrl}`);
                const response = await fetch(apiUrl);

                const responseData = await response.json();

                if (!response.ok) {
                    // Use error message from Payment Gateway if available
                    const errorMessage = responseData?.error?.message || responseData?.reason || `HTTP error! Status: ${response.status}`;
                    throw new Error(errorMessage);
                }

                // Check if the expected data structure is present
                if (!responseData.data || !responseData.data.id) {
                    throw new Error("Invalid API response structure received from Payment Gateway.");
                }

                setTransactionDetails(responseData.data);

            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'An unknown error occurred while fetching details.';
                console.error("Failed to fetch transaction details:", err);
                setError(message);
            } finally {
                setIsLoading(false); // Stop loading in both success and error cases
            }
        };

        fetchTransactionDetails();

    }, [searchParams]);

    // --- Helper function to render status icon ---
    const renderStatusIcon = (status: PaymentGatewayTransactionData['status'] | null) => {
        switch (status) {
            case 'APPROVED':
                return <CheckCircle className="w-16 h-16 text-green-500 mb-4" />;
            case 'DECLINED':
            case 'ERROR':
            case 'VOIDED':
                return <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />;
            case 'PENDING':
                 return <Clock className="w-16 h-16 text-yellow-500 mb-4" />;
            default:
                 return <AlertTriangle className="w-16 h-16 text-gray-500 mb-4" />; // Fallback/Unknown
        }
    };

     // --- Helper function to render status title ---
    const renderStatusTitle = (status: PaymentGatewayTransactionData['status'] | null) => {
        switch (status) {
            case 'APPROVED': return 'Payment Successful!';
            case 'DECLINED': return 'Payment Declined';
            case 'ERROR': return 'Payment Error';
            case 'PENDING': return 'Payment Pending';
            case 'VOIDED': return 'Payment Voided';
            default: return 'Payment Status Unknown';
        }
    };

    // --- Main Render ---
    return (
        <div className="container mx-auto px-4 py-12 flex justify-center items-start min-h-screen">
            <Card className="w-full max-w-lg">
                <CardHeader className="items-center text-center">
                    {/* Loading State */}
                    {isLoading && (
                         <>
                            <Loader2 className="w-16 h-16 text-blue-500 mb-4 animate-spin" />
                            <CardTitle className="text-2xl">Loading Details...</CardTitle>
                            <CardDescription>Fetching transaction information from Payment Gateway.</CardDescription>
                         </>
                    )}

                    {/* Error State (Fetch Error or Missing ID) */}
                    {!isLoading && error && (
                        <>
                           <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
                           <CardTitle className="text-2xl">Error</CardTitle>
                           <CardDescription>Could not retrieve transaction details.</CardDescription>
                        </>
                    )}

                    {/* Data Loaded State */}
                    {!isLoading && !error && transactionDetails && (
                        <>
                            {renderStatusIcon(transactionDetails.status)}
                            <CardTitle className="text-2xl">
                               {renderStatusTitle(transactionDetails.status)}
                            </CardTitle>
                            {transactionDetails.status_message && (
                                <CardDescription className="mt-2 text-sm text-muted-foreground">
                                    {transactionDetails.status_message}
                                </CardDescription>
                            )}
                            {/* Success message if approved and no specific status message */}
                             {transactionDetails.status === 'APPROVED' && !transactionDetails.status_message && (
                                 <CardDescription>Thank you! Your transaction is complete.</CardDescription>
                             )}
                        </>
                    )}
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Show Fetch Error Message */}
                    {error && (
                        <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Error Details</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Show Transaction Details */}
                    {!isLoading && !error && transactionDetails && (
                        <div className="border-t pt-4 mt-4 text-sm text-gray-600 dark:text-gray-300 space-y-2">
                            <p className='flex justify-between'>
                                <span>Status:</span>
                                <span className={`font-medium ${
                                    transactionDetails.status === 'APPROVED' ? 'text-green-600' :
                                    transactionDetails.status === 'PENDING' ? 'text-yellow-600' :
                                    'text-red-600' // Declined, Error, Voided
                                }`}>{transactionDetails.status}</span>
                            </p>
                             <p className='flex justify-between'>
                                <span>Transaction ID:</span>
                                <span className='font-mono text-xs'>{paymentGatewayTransactionId}</span>
                                {/* <span className='font-mono text-xs'>{transactionDetails.id}</span> */}
                                {/* It's posible to use the line 187 or 188 to show the payment gateway transaction ID */}
                             </p>
                            <p className='flex justify-between'>
                                <span>Order Reference:</span>
                                <span className='font-medium'>{transactionDetails.reference}</span>
                            </p>
                            <p className='flex justify-between'>
                                <span>Amount:</span>
                                <span className='font-semibold'>
                                    {(transactionDetails.amount_in_cents / 100).toLocaleString(undefined, {
                                        style: 'currency',
                                        currency: transactionDetails.currency
                                    })}
                                </span>
                            </p>
                            <p className='flex justify-between'>
                                <span>Payment Method:</span>
                                <span className='font-medium capitalize'>
                                    {transactionDetails.payment_method?.extra?.brand?.toLowerCase() ?? transactionDetails.payment_method_type}
                                    {transactionDetails.payment_method?.extra?.last_four && ` **** ${transactionDetails.payment_method.extra.last_four}`}
                                </span>
                            </p>
                            <p className='flex justify-between'>
                                <span>Date:</span>
                                <span className='font-medium'>
                                     {new Date(transactionDetails.finalized_at ?? transactionDetails.created_at).toLocaleString()}
                                </span>
                            </p>
                        </div>
                    )}

                     {/* Show Skeleton while loading */}
                    {isLoading && (
                        <div className="border-t pt-4 mt-4 space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-1/2" />
                             <Skeleton className="h-4 w-5/6" />
                        </div>
                    )}

                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
                    <Button asChild variant="outline" disabled={isLoading}>
                        <Link to="/my-transactions">View My Transactions</Link>
                    </Button>
                    <Button asChild disabled={isLoading}>
                        <Link to="/">Return to Homepage</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default PaymentSuccessPage;