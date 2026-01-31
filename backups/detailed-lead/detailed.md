your first taskL:

deeply analyze and understand files andd folders under frontend-main


app-dashboard-leadmanagement--->inside e this deeply analyze and study all the files
1) components
2) data
3) forms'
4) page.tsx

deeply analyze and understand all the files inside this all files 
take a good understanding it from 
after that deeply study DashboardService.ts file and understand the api flow
for the detailed lead creation viewing , documenete etc.

once it is done -->
in our main mobile folder , deeply analyze and study the theme.js , all navoigation files , all files and folders under the  dashboard folder , each file analyze our current staus for the detailed lead cretion functtionlity all files AddDetailedLeadScreen.js LeadManagementScreen.js ReferralLeadModal.js analyze this file deeply and understand them 


in this for now implement the loans:

1) Home Loans
2) Personal Loans lead creation functionlity 

implement all the functionlity into this 

creation 

in 2 steps just like the frontend-main

use the analysis made and things understood from them 

make everthing works fine

create best file and folder structure by keeping existing functtinlity working

view docs :  (image , pdf)
upload : 
view form 

follow best coding practices , do a deep research , how we can all the web functility onto our mobile app 



create a detailed lead :

 http://192.168.1.58:5000/api/dashboard/create-detail-lead

 
// Case 1: Referral Lead (is_self_login = true)

{
  "department": "Loan",
  "product_type": "Home Loan",
  "sub_category": "Home Loan",
  "client": {
    "name": "Rahul Sharma",
    "mobile": "9876543210",
    "email": "rahul.sharma@gmail.com"
  },
  "meta": {
    "is_self_login": true
  },
  "form_data": {
    "refId": "REF12345",
    "fileId": "FILE67890",
    "bankName": "HDFC Bank",
    "rmName": "Amit Verma",
    "location": "Mumbai",
    "loanAmount": "4500000"
  }
}



// // Case 2: Detailed Lead (is_self_login = false)


// {
//   "department": "Loan",
//   "product_type": "Home Loan",
//   "sub_category": "Home Loan",
//   "client": {
//     "name": "Priya Mehta",
//     "mobile": "9123456789",
//     "email": "priya.mehta@gmail.com"
//   },
//   "meta": {
//     "is_self_login": false
//   },
//   "form_data": {
//     "loanType": "Home Purchase",
//     "dob": "1992-08-15",
//     "location": "Pune",
//     "loanAmount": "6000000",
//     "employmentType": "Salaried",
//     "hasOtherLoan": true,
//     "otherLoanAmount": "800000",
//     "otherIncome": "Freelancing",
//     "otherIncomeAmount": "25000"
//   }
// }


backend response:
{
    "success": true,
    "detail_lead_id": "HL/2025-26/0006"
}

get detailed lead :

 http://192.168.1.58:5000/api/dashboard/get-my-detail-leads

 backend response :

 {
    "success": true,
    "count": 2,
    "data": [
        {
            "id": 6,
            "detail_lead_id": "HL/2025-26/0006",
            "lead_name": "Priya Mehta",
            "contact_number": "9123456789",
            "email": "priya.mehta@gmail.com",
            "is_self_login": false,
            "form_data": {
                "dob": "1992-08-15",
                "loanType": "Home Purchase",
                "location": "Pune",
                "loanAmount": "6000000",
                "otherIncome": "Freelancing",
                "hasOtherLoan": true,
                "employmentType": "Salaried",
                "otherLoanAmount": "800000",
                "otherIncomeAmount": "25000"
            },
            "department": "Loan",
            "sub_category": "Home Loan",
            "created_at": "2026-01-31T07:19:51.181Z"
        },
        {
            "id": 5,
            "detail_lead_id": "HL/2025-26/0005",
            "lead_name": "Rahul Sharma",
            "contact_number": "9876543210",
            "email": "rahul.sharma@gmail.com",
            "is_self_login": true,
            "form_data": {
                "refId": "REF12345",
                "fileId": "FILE67890",
                "rmName": "Amit Verma",
                "bankName": "HDFC Bank",
                "location": "Mumbai",
                "loanAmount": "4500000"
            },
            "department": "Loan",
            "sub_category": "Home Loan",
            "created_at": "2026-01-31T07:11:59.901Z"
        }
    ]
}

get lead documents :

http://192.168.1.58:5000/api/dashboard/detail-lead/5/all-documents

backend response :

{
    "success": true,
    "pending": [
        {
            "document_key": "PHOTOGRAPH",
            "document_label": "Photograph"
        },
        {
            "document_key": "ADDRESS_PROOF",
            "document_label": "Address Proof"
        },
        {
            "document_key": "COST_SHEET",
            "document_label": "Property Cost Sheet / Index II"
        },
        {
            "document_key": "CONTRIBUTION_PROOF",
            "document_label": "Own Contribution Proof"
        },
        {
            "document_key": "SALARY_SLIP",
            "document_label": "3 Months Salary Slip"
        },
        {
            "document_key": "FORM16",
            "document_label": "2 Years Form 16"
        },
        {
            "document_key": "BANK_STATEMENT",
            "document_label": "6 Months Banking Statement"
        },
        {
            "document_key": "AADHAAR",
            "document_label": "Aadhaar Card"
        },
        {
            "document_key": "PAN",
            "document_label": "Pan Card"
        },
        {
            "document_key": "UDYAM",
            "document_label": "Udyam Registration"
        },
        {
            "document_key": "SHOP_ACT",
            "document_label": "Shop Act Licence"
        },
        {
            "document_key": "CURRENT_BANK_STMT",
            "document_label": "1 Current Banking Statement"
        },
        {
            "document_key": "SAVING_BANK_STMT",
            "document_label": "Saving Bank Account"
        },
        {
            "document_key": "ITR",
            "document_label": "3 Years ITR"
        },
        {
            "document_key": "GST_CERTIFICATE",
            "document_label": "GST Certificate"
        },
        {
            "document_key": "GST_RETURNS",
            "document_label": "Last 12 Months GST Returns"
        },
        {
            "document_key": "PPO",
            "document_label": "PPO (Pension Payment Order)"
        },
        {
            "document_key": "PENSION_STMT",
            "document_label": "1 Year Pension Credit Statement"
        },
        {
            "document_key": "RENT_AGREEMENT",
            "document_label": "Rent Agreement"
        },
        {
            "document_key": "RENT_STMT",
            "document_label": "1 Year Rent Credit Statement"
        },
        {
            "document_key": "EXISTING_LOAN",
            "document_label": "Existing Loan Statement"
        }
    ],
    "uploaded": []
}


when our id was 6 that is case 2 "is_self_login": false,























{
    "success": true,
    "pending": [
        {
            "document_key": "BANK_STATEMENT",
            "document_label": "6 Months Banking Statement"
        },
        {
            "document_key": "ADDRESS_PROOF",
            "document_label": "Address Proof"
        },
        {
            "document_key": "PHOTOGRAPH",
            "document_label": "Photograph"
        },
        {
            "document_key": "COMPANY_ID",
            "document_label": "Company ID Card"
        }
    ],
    "uploaded": [
        {
            "document_key": "AADHAAR",
            "document_label": "Aadhaar Card",
            "file_url": "https://infinity-client-documents.s3.ap-south-1.amazonaws.com/users/2638/leads/PL_2025-26_0001/Loan/AADHAAR/e1cfbe07-a074-4c94-96ce-97e260e5fc5a.jpg",
            "uploaded_at": "2026-01-31T09:44:49.310Z"
        },
        {
            "document_key": "PAN",
            "document_label": "Pan Card",
            "file_url": "https://infinity-client-documents.s3.ap-south-1.amazonaws.com/users/2638/leads/PL_2025-26_0001/Loan/PAN/bb009775-f322-4fdb-97a4-ad9d6e41115c.jpg",
            "uploaded_at": "2026-01-31T09:45:03.435Z"
        },
        {
            "document_key": "SALARY_SLIP",
            "document_label": "3 Months Salary Slip",
            "file_url": "https://infinity-client-documents.s3.ap-south-1.amazonaws.com/users/2638/leads/PL_2025-26_0001/Loan/SALARY_SLIP/3f2aa45c-2f95-4019-b5f3-60e91a1571ed.jpg",
            "uploaded_at": "2026-01-31T09:46:36.084Z"
        },
        {
            "document_key": "FORM16",
            "document_label": "Form 16",
            "file_url": "https://infinity-client-documents.s3.ap-south-1.amazonaws.com/users/2638/leads/PL_2025-26_0001/Loan/FORM16/019061e9-d169-472a-970f-88869f092288.jpg",
            "uploaded_at": "2026-01-31T09:46:47.068Z"
        }
    ]
}