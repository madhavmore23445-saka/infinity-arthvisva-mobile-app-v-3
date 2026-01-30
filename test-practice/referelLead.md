  
  made chanegs 


  1) theme.js
  2) referreal lead
  3)ndetailed lead
now deeply analyze the AddLeadModal.ts file and all files inside the leadmanagement folder 

and 
adminService.ts
productCard.ts

deeply analyze all files inside this folders and get a good understanding for building the 


take the briefnunderstanding of the referral Leads and detailed Leads ,

for now we will complete the referral Leads.js and  detailed Leads we will create the 

referral Leads
and 
detailed Leads 

i have shared 2 images , make sure keep the ui same 

as shown in the ui 

in leadmanageent.js 

heading
below 2 buttons 

1) referral Leads 2) add detailed Leads 

below that , referral Leads (3)
detailed Leads (1) , switch options to view the table format data , just after that a filter to show , 5 , 10 , 20 , 25 and just below it. a search functionity 

search on the basis of : Ref ID	Client	Contact	Dept


when click on it show , loans , insurance , mutual funds investments real estate unlisted and when click on particular , show particular detail , in card and option click to add , when click on it , for now do nothing 


to implement this you need to firstly undderstand the 

in main frontend-main ----> website code 
inside app , inside dashboard inside lead management understand components , data forms types , page.tsx , you need to analyze and understand this , correctly 


to implement the refereel follow best coding and folder strucure 

create separate 




  Lead Management.js

  at the top show :Efficiently manage your sales pipeline from initial contact to conversion.

BELOW THAT 2 BUTTONS 

1) referral Leads () IN BRACKET SHOW THERE COUNT

2) detailed Leads (1)

when click on referral Leads  open a form with fields like(deeply analyze this file :AddLeadModal.tsx 
  ) 
    api:

    
    
post: http://192.168.1.58:5000/api/dashboard/create-referral-lead

in body:
{
  "lead_name": "Rahul Sharma",
  "contact_number": "9123456789",
  "email": "rahul.sharma@example.com",
  "department": "Loan",
  "sub_category": "Home Loan",
  "notes": "Customer is looking for flexible EMI options"
}


if 
  department
  sub_category


  is wrong 


  {
    "success": false,
    "message": "No RM available for selected department and category"
}

if everthing is correct :

{
    "success": true,
    "message": "Referral lead created successfully"
}


once it is createed -->


to get all  leads to display :
get---> just auth token is required
 http://192.168.1.58:5000/api/dashboard/get-leads




backend response---->
display this data in proper way , immediately after create on the same screen , inside referrel lead

in referell lead show :

ID	Ref ID	Client	Contact	Dept	Product(sub_category)	Notes	Created
{
    "success": true,
    "count": 4,
    "data": [
        {
            "id": 6,
            "ref_id": "REF_0077",
            "lead_name": "Rahul Sharma",
            "contact_number": "9123456789",
            "email": "rahul.sharma@example.com",
            "department": "Loan",
            "sub_category": "Home Loan",
            "notes": "Customer is looking for flexible EMI options",
            "status": "INCOMING",
            "created_at": "2026-01-29T10:15:44.365Z"
        },
        {
            "id": 5,
            "ref_id": "REF_0076",
            "lead_name": "Rahul Sharma",
            "contact_number": "9123456789",
            "email": "rahul.sharma@example.com",
            "department": "Loan",
            "sub_category": "Home Loan",
            "notes": "Customer is looking for flexible EMI options",
            "status": "INCOMING",
            "created_at": "2026-01-29T10:15:22.385Z"
        },
        {
            "id": 4,
            "ref_id": "REF_0075",
            "lead_name": "Rahul Sharma",
            "contact_number": "9123456789",
            "email": "rahul.sharma@example.com",
            "department": "Loan",
            "sub_category": "Home Loan",
            "notes": "Customer is looking for flexible EMI options",
            "status": "INCOMING",
            "created_at": "2026-01-29T10:15:20.938Z"
        },
        {
            "id": 3,
            "ref_id": "REF_0074",
            "lead_name": "Rahul Sharma",
            "contact_number": "9123456789",
            "email": "rahul.sharma@example.com",
            "department": "Loan",
            "sub_category": "Home Loan",
            "notes": "Customer is looking for flexible EMI options",
            "status": "INCOMING",
            "created_at": "2026-01-29T10:15:17.849Z"
        }
    ]
}