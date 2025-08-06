print("Starting backend...")
# FastAPI backend code goes here (will provide full code in next steps)
from fastapi import FastAPI, UploadFile, File, Form, BackgroundTasks, HTTPException, Depends, Query
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
from typing import List, Optional, Dict
import pdfplumber
import docx
from PIL import Image
import pytesseract
from dotenv import load_dotenv
import json
import uuid
from datetime import datetime
import hashlib
# from docx2pdf import convert  # Commented out due to installation issues
from pydantic import BaseModel, EmailStr
import requests

app = FastAPI()

# ... (rest of the code remains unchanged, as in main.py) ... 

@app.get("/report/{report_id}")
def get_report(
    report_id: str, 
    format: str = Query("docx", enum=["docx", "pdf"]),
    current_user: Dict = Depends(get_current_user)
):
    # Ensure user can only access their own reports
    if not report_id.startswith(current_user['id']):
        print(f"Access denied: User {current_user['id']} tried to access report {report_id}")
        raise HTTPException(status_code=403, detail="Access denied - You can only access your own reports")
    
    user_id = current_user['id']
    user_report_dir = os.path.join(REPORT_DIR, user_id)
    
    report_path_docx = os.path.join(user_report_dir, f"report_{report_id}.docx")
    
    if not os.path.exists(report_path_docx):
        print(f"Report not found: {report_path_docx}")
        raise HTTPException(status_code=404, detail="Report not found")

    # PDF export is disabled due to docx2pdf installation issues
    # if format.lower() == 'pdf':
    #     report_path_pdf = os.path.join(user_report_dir, f"report_{report_id}.pdf")
    #     # Convert to PDF if it doesn't exist
    #     if not os.path.exists(report_path_pdf):
    #         try:
    #             print(f"Converting {report_path_docx} to PDF...")
    #             convert(report_path_docx, report_path_pdf)
    #             print("Conversion complete.")
    #         except Exception as e:
    #             print(f"Error converting to PDF: {e}")
    #             raise HTTPException(status_code=500, detail="Failed to convert report to PDF.")
    #     return FileResponse(
    #         report_path_pdf, 
    #         media_type="application/pdf", 
    #         filename=f"AI_Document_Analysis_{report_id}.pdf"
    #     )

    # Default to DOCX
    return FileResponse(
        report_path_docx, 
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document", 
        filename=f"AI_Document_Analysis_{report_id}.docx"
    )

# ... (rest of the code remains unchanged, as in main.py) ... 