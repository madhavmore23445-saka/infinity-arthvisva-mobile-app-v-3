api :
deeply analyze our existing frontend folder structure and api flows and theme.js and navigation files after that
\
new changes to be made

  
web application folder deeply analyze guide 
inside frontend-main 
app -dashboard-clientPortfolio --> deeply analyze and understand it and its relevant file
 /api/dashboard/all-client-detail

 backend response:
"success": true,
    "count": 3,
    "data": [
        {
            "source": "DETAIL LEAD",
            "lead_id": "HL/2025-26/0003",
            "lead_name": "Priya Mehta",
            "contact_number": "9123456789",
            "email": "priya.mehta@gmail.com",
            "department": "Loan",
            "sub_category": "Home Loan",
            "created_at": "2026-01-30T11:17:00.375Z"
        },
        {
            "source": "DETAIL LEAD",
            "lead_id": "HL/2025-26/0002",
            "lead_name": "Rahul Sharma",
            "contact_number": "9876543210",
            "email": "rahul.sharma@gmail.com",
            "department": "Loan",
            "sub_category": "Home Loan",
            "created_at": "2026-01-30T10:16:46.203Z"
        },
        {
            "source": "REFERRAL LEAD",
            "lead_id": "REF_0031",
            "lead_name": "Raghav",
            "contact_number": "8010097706",
            "email": "madhavmore395@gmail.com",
            "department": "Insurance",
            "sub_category": "Travel Insurance",
            "created_at": "2026-01-30T09:29:16.224Z"
        }
    ]
}


display the backend response in propre format 

export const DashboardServics.js file , in this file , add the api 


and aftre that there is clientPortfolio folder inside this 

there are components , data and ClientPortfolioScreen.js file this will be our main showing 

functionlities 

filter functionlity based on

 Category

Product

and search functiolity also 

main 3 tabs with switch functionlity 

clients(count) , applications documents 

in Client Portfolio Details section display the data in proper format 

gor now in the other tabs , show No applications found 

display : Client Portfolio Details

lead ID	Source	Client Name	Contact Details	Dept / Sub-Cat	Created At

just like shown in the image 


before implementing this take a brief understanding from the categories.ts file ClientDetails.ts and all files inside the clientPortfolio ---> which is in our frontend-main folder structure which is a web application , take a brief understanding from it and accordinlgy with mentioned functionlity implement it on the our frontend app screennm 


make sure use best coding practices and files and folder structure 

create a functionlites inside componensts folder which is inside our clientPortfolio and in the data folder , show the data which is in the like this : 

export const categories = {
    'All': ['All'],
    'Loan': ['Personal Loan', 'Home Loan', 'Business Loan', 'Car Loan', 'Education Loan', 'Mortgage Loan', 'SME Loan', 'Balance Transfer Loan', 'Vehicle Loan', 'Loan Against Securities', 'Debt Capital Market (DCM)'],
    'Insurance': ['Life Insurance', 'Health Insurance', 'Motor Insurance', 'Travel Insurance', 'Property Insurance', 'Cattle Insurance', 'Marine Insurance'],
    'Investment': ['Mutual Funds', 'Stocks', 'Fixed Deposits', 'Bonds', 'Real Estate', 'Wealth Management', 'PMS / AIF']
} as const;

export type Category = keyof typeof categories;

// Product to category mapping
export const productCategoryMap: { [key: string]: string } = {
    'Personal Loan': 'Loan',
    'Home Loan': 'Loan',
    'Business Loan': 'Loan',
    'Car Loan': 'Loan',
    'Education Loan': 'Loan',
    'Mortgage Loan': 'Loan',
    'SME Loan': 'Loan',
    'Balance Transfer Loan': 'Loan',
    'Vehicle Loan': 'Loan',
    'Loan Against Securities': 'Loan',
    'Debt Capital Market (DCM)': 'Loan',
    'Insurance': 'Insurance',
    'Life Insurance': 'Insurance',
    'Health Insurance': 'Insurance',
    'Motor Insurance': 'Insurance',
    'Travel Insurance': 'Insurance',
    'Property Insurance': 'Insurance',
    'Cattle Insurance': 'Insurance',
    'Marine Insurance': 'Insurance',
    'Mutual Funds': 'Investment',
    'Credit Card': 'Credit',
    'Investment': 'Investment',
    'Stocks': 'Investment',
    'Fixed Deposits': 'Investment',
    'Bonds': 'Investment',
    'Real Estate': 'Investment',
    'Wealth Management': 'Investment',
    'PMS / AIF': 'Investment',
    'Credit Line': 'Credit',
};



