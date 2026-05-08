import os

docs = {}

docs["01_employee_handbook.txt"] = """
MERIDIAN WORKS EMPLOYEE HANDBOOK
Version 3.2 | Effective January 2025

ABOUT MERIDIAN WORKS
Meridian Works is a 120-person product and services company headquartered in Lagos, Nigeria. Founded in 2017, we help African businesses build and scale digital products. Our teams span Product, Engineering, Design, Sales, Operations, and People & Culture.

OUR VALUES
1. Ownership: We take full responsibility for our work and its outcomes.
2. Clarity: We communicate directly, document thoroughly, and avoid ambiguity.
3. Growth: We invest in our people and expect people to invest in themselves.
4. Integrity: We do the right thing even when no one is watching.
5. Collaboration: Great work is rarely solo work.

WORKING HOURS
Standard working hours are 9:00am to 6:00pm WAT, Monday to Friday. Flexible start times between 8:00am and 10:00am are permitted with team lead approval. Core collaboration hours are 10:00am to 4:00pm, during which all team members are expected to be reachable.

PROBATION PERIOD
All new employees serve a 3-month probation period. During this period, either party may terminate employment with 1 week's notice. Successful completion of probation is confirmed in writing by the People & Culture team.

CODE OF CONDUCT SUMMARY
All employees are expected to treat colleagues, clients, and partners with respect. Harassment, discrimination, and dishonesty are grounds for immediate disciplinary action. The full Code of Conduct is contained in a separate document.

DRESS CODE
Meridian Works maintains a smart-casual dress code. Client-facing days or formal meetings may require business attire. Team leads communicate dress expectations in advance.

PUBLIC HOLIDAYS
Employees observe all Nigerian federal public holidays. A calendar of observed holidays is shared at the start of each year by the People & Culture team.

COMMUNICATIONS AND TOOLS
Slack is the primary internal communication tool. Email is used for external and formal communications. Notion is used for documentation. All company tools are provisioned by the IT team on your first day.

AMENDMENTS
This handbook is reviewed annually. Employees are notified of material changes via email and Slack. The most current version is always available on the company Notion.
""".strip()

docs["02_onboarding_guide.txt"] = """
MERIDIAN WORKS ONBOARDING GUIDE
For New Employees | People & Culture Team

WELCOME
Congratulations on joining Meridian Works. This guide walks you through your first 30 days and tells you everything you need to know to get started effectively.

BEFORE YOUR FIRST DAY
- You will receive a welcome email from People & Culture with your start date, reporting manager, and first-day logistics.
- Your laptop will be configured and ready for collection on Day 1.
- You will receive Slack, email, and Notion access within the first two hours of Day 1.

WEEK 1: ORIENTATION
Day 1: Meet your team lead and People & Culture contact. Collect your equipment. Complete IT setup. Read the Employee Handbook and sign the acknowledgement form.
Day 2-3: Complete mandatory onboarding sessions: Company Overview, Security Awareness, and Tools Training.
Day 4-5: Shadow your team. Attend your first team standup. Meet your onboarding buddy.

ONBOARDING BUDDY
Every new hire is assigned an onboarding buddy, a colleague in a similar role who helps you navigate the company in your first month. Your buddy is not your manager. They are a peer resource for informal questions.

WEEK 2-4: RAMP UP
You will be assigned starter tasks appropriate to your role. Your team lead will set 30-day goals with you in your first week. A check-in meeting is scheduled at the end of Week 2 and Week 4.

MANDATORY TRAINING
All employees must complete the following in their first 2 weeks:
1. Data Protection and Privacy Training
2. Security Awareness Training
3. Anti-Harassment and Code of Conduct Training
Completion is tracked by the People & Culture team. Incomplete training after 2 weeks is escalated to your team lead.

EQUIPMENT AND TOOLS
You will receive a company laptop. Personal devices may be used for communication but not for storing company data. Full list of provisioned tools is in the IT section of Notion.

30-DAY CHECK-IN
At the end of your first month, you will have a formal check-in with your team lead and People & Culture. This is a two-way conversation about your experience, role clarity, and any support you need.

KEY CONTACTS
People & Culture: people@meridianworks.co
IT Support: it@meridianworks.co
Finance: finance@meridianworks.co
""".strip()

docs["03_leave_and_absence_policy.txt"] = """
MERIDIAN WORKS LEAVE AND ABSENCE POLICY
Effective January 2025 | People & Culture

1. ANNUAL LEAVE
All full-time employees are entitled to 20 working days of annual leave per calendar year. Leave accrues at 1.67 days per month. Employees on probation accrue leave but may not take it until probation is successfully completed, except in exceptional circumstances approved by People & Culture.

2. LEAVE CARRY-OVER
A maximum of 5 unused leave days may be carried over to the following year. Carried-over days must be used by 31 March or they are forfeited. Exceptions require written approval from the Chief People Officer.

3. REQUESTING LEAVE
Leave requests must be submitted at least 5 working days in advance for absences of 3 days or fewer. For absences longer than 3 days, at least 10 working days notice is required. All leave is requested via the HR portal. Approval is at the team lead's discretion, taking into account team capacity.

4. SICK LEAVE
Employees are entitled to 10 days of paid sick leave per calendar year. Absences of 3 or more consecutive days require a medical certificate. Sick leave beyond 10 days in a calendar year is unpaid unless covered by a medical plan. Patterns of frequent short-term absences may trigger a welfare check with People & Culture.

5. MATERNITY LEAVE
Female employees who have completed 6 months of continuous service are entitled to 16 weeks of paid maternity leave. This may begin up to 4 weeks before the expected due date. An additional 4 weeks of unpaid maternity leave may be requested.

6. PATERNITY LEAVE
Male employees and partners are entitled to 2 weeks of paid paternity leave within 4 weeks of the birth or adoption of a child. This applies after 6 months of continuous service.

7. BEREAVEMENT LEAVE
Employees are entitled to 5 days paid bereavement leave for the death of an immediate family member (spouse, child, parent, sibling). 2 days are granted for extended family members. Additional unpaid leave may be requested at the discretion of People & Culture.

8. UNPAID LEAVE
Unpaid leave may be granted at the discretion of the team lead and People & Culture for circumstances not covered by other leave types. Requests must be submitted in writing with reasons.

9. PUBLIC HOLIDAYS
All Nigerian federal public holidays are observed. Employees required to work on a public holiday will receive a day off in lieu within 30 days.

10. UNAUTHORISED ABSENCE
Absence without prior approval or notification within 2 hours of the start of the working day is considered unauthorised. Three instances of unauthorised absence in a rolling 12-month period may result in disciplinary action.
""".strip()

docs["04_code_of_conduct.txt"] = """
MERIDIAN WORKS CODE OF CONDUCT
Effective January 2025

1. PURPOSE
This Code of Conduct sets out the standards of behaviour expected of all Meridian Works employees, contractors, and representatives. It applies in the workplace, at company events, and in any context where you are representing Meridian Works.

2. RESPECT AND INCLUSION
Meridian Works is committed to a workplace free from harassment, discrimination, and intimidation. All employees are entitled to be treated with dignity regardless of gender, age, ethnicity, religion, disability, sexual orientation, or any other characteristic. Discriminatory language, jokes, or behaviour will not be tolerated.

3. HARASSMENT
Harassment includes unwanted physical contact, offensive remarks, persistent unwanted communication, and any conduct that creates a hostile or uncomfortable environment. Harassment by or against employees, clients, or partners is a disciplinary offence.

4. CONFLICTS OF INTEREST
Employees must disclose any situation where personal interests may conflict with those of Meridian Works. This includes outside employment, financial interests in clients or competitors, and personal relationships with vendors. Disclosures are made to People & Culture in writing.

5. CONFIDENTIALITY
Employees must not share confidential company information, client data, or proprietary processes with unauthorised parties. This obligation continues after employment ends. All employees sign a confidentiality agreement as part of their contract.

6. USE OF COMPANY RESOURCES
Company resources, including equipment, software, and time, are for business purposes. Limited personal use of tools like Slack and email is acceptable. Misuse of company resources, including unauthorised access to systems, is a disciplinary offence.

7. SOCIAL MEDIA
Employees must not make statements about Meridian Works, its clients, or colleagues on social media that are misleading, defamatory, or damaging. Personal opinions on professional topics are permitted but must be clearly identified as personal views.

8. GIFTS AND HOSPITALITY
Employees must not accept gifts valued above 20,000 NGN from clients, vendors, or partners without prior approval from their team lead and People & Culture. Offering gifts to influence business decisions is prohibited.

9. REPORTING VIOLATIONS
Employees who witness or experience a violation of this Code are encouraged to report it to People & Culture or their team lead. Anonymous reporting is available via the company's ethics hotline. Retaliation against anyone who reports in good faith is a serious disciplinary offence.

10. CONSEQUENCES
Violations of this Code may result in disciplinary action up to and including termination of employment, depending on the severity and circumstances of the breach.
""".strip()

docs["05_performance_review_framework.txt"] = """
MERIDIAN WORKS PERFORMANCE REVIEW FRAMEWORK
People & Culture | Updated January 2025

1. OVERVIEW
Performance reviews at Meridian Works are designed to support growth, recognise achievement, and address underperformance early. Reviews are not a judgment exercise. They are a structured conversation between employee and manager.

2. REVIEW CYCLE
Formal reviews occur twice per year: Mid-Year Review in July and Annual Review in December. New employees have an additional 90-Day Review at the end of probation. Informal check-ins between manager and direct report are expected monthly.

3. RATING SCALE
Performance is assessed on a 4-point scale:
4 - Exceeds Expectations: Consistently delivers above and beyond role requirements.
3 - Meets Expectations: Reliably delivers to the standard required for the role.
2 - Developing: Partially meets expectations. A development plan is required.
1 - Below Expectations: Significantly below required standard. Formal improvement plan initiated.

4. REVIEW COMPONENTS
Self-Assessment: Employee reflects on their performance against goals set in the previous cycle.
Manager Assessment: Team lead evaluates the employee against role competencies and goals.
Calibration: Team leads align ratings across the team with their department head to ensure consistency.
Review Meeting: A structured 1:1 conversation where both assessments are discussed and goals for the next cycle are set.

5. GOALS SETTING
Each employee sets 3 to 5 goals per review cycle using the SMART framework. Goals are agreed between the employee and their team lead and recorded in the HR portal. Goals may be updated mid-cycle with mutual agreement.

6. COMPENSATION LINK
Annual reviews are linked to salary review decisions. Employees rated 3 or above are eligible for merit increases. Employees rated 2 or below are not eligible for an increase until performance improves. Ratings of 4 may be considered for accelerated progression.

7. DEVELOPMENT PLANS
Employees rated 2 receive a written development plan within 2 weeks of their review. The plan includes specific improvement targets, support to be provided, and a review date within 60 days.

8. APPEALS
Employees who disagree with their review outcome may raise a formal appeal with People & Culture within 10 working days of receiving their review. Appeals are reviewed by a senior manager not involved in the original assessment.

9. DOCUMENTATION
All review forms, goals, and development plans are stored in the HR portal. Employees have access to their own records at all times.
""".strip()

docs["06_compensation_and_benefits.txt"] = """
MERIDIAN WORKS COMPENSATION AND BENEFITS GUIDE
Effective January 2025 | Confidential

1. SALARY STRUCTURE
Meridian Works operates a banded salary structure with defined ranges for each role level. Bands are reviewed annually in Q4 and adjusted for market competitiveness. Salary offers are made within the band for the role. Employees may view their band range on request from People & Culture.

2. SALARY REVIEW
Salary reviews occur annually following the December performance review. Increases are effective from 1 February. Eligibility requires a performance rating of 3 or above. Increases are not guaranteed and depend on company performance and individual rating.

3. PENSION
Meridian Works contributes 10% of basic salary to a pension scheme in compliance with the Pension Reform Act. The employee contributes a minimum of 8%. Contributions begin after the probation period is successfully completed.

4. HEALTH INSURANCE
All employees are enrolled in the company health plan from Day 1. The plan covers the employee, one spouse, and up to three children. Coverage includes outpatient, inpatient, dental, and optical. The company covers 100% of the employee premium and 70% of dependent premiums.

5. ANNUAL BONUS
A discretionary annual bonus is paid in January based on company performance and individual rating. Target bonus is 10% of annual basic salary for all employees. Employees must be in employment on 31 December to be eligible. Employees on a performance improvement plan are not eligible.

6. TRANSPORTATION ALLOWANCE
All employees receive a monthly transportation allowance of 30,000 NGN. Remote employees receive a home office allowance of 20,000 NGN per month instead.

7. MEAL SUBSIDY
Employees working from the Lagos office receive a daily meal subsidy of 2,000 NGN on days worked in the office, delivered via the company meal card.

8. LEARNING AND DEVELOPMENT
Each employee has an annual L&D budget of 150,000 NGN for courses, conferences, and certifications relevant to their role. Requests are submitted to the team lead and approved by People & Culture. Unused budget does not roll over.

9. EQUITY
Senior employees at Band 5 and above may be eligible for stock options under the company's Employee Stock Option Plan. Eligibility and terms are communicated individually by the Chief People Officer.

10. SALARY PAYMENT
Salaries are paid on the 25th of each month. If the 25th falls on a weekend or public holiday, payment is made on the preceding working day.
""".strip()

docs["07_disciplinary_and_grievance.txt"] = """
MERIDIAN WORKS DISCIPLINARY AND GRIEVANCE PROCEDURE
People & Culture | Effective January 2025

PART A: DISCIPLINARY PROCEDURE

1. PURPOSE
This procedure ensures that concerns about employee conduct or performance are dealt with fairly, consistently, and promptly.

2. INFORMAL STAGE
Minor issues are addressed informally by the team lead in the first instance. A private conversation is held, the concern is explained, and the employee is given an opportunity to respond. A note of the conversation is kept by the team lead.

3. FORMAL STAGES
If informal action does not resolve the issue, or if the matter is more serious, the formal procedure is initiated:

Stage 1: Verbal Warning
A formal meeting is held with the employee, their team lead, and a People & Culture representative. The employee may bring a colleague as support. If a verbal warning is issued, it is confirmed in writing and remains on file for 6 months.

Stage 2: Written Warning
If the issue persists or a further offence occurs within 6 months of a verbal warning, a written warning is issued. A written warning remains on file for 12 months.

Stage 3: Final Written Warning
A further offence within 12 months of a written warning results in a final written warning. The employee is informed that dismissal may follow any further breach.

Stage 4: Dismissal
Dismissal may follow a final written warning or, in cases of gross misconduct, may be immediate. Gross misconduct includes theft, fraud, serious harassment, and wilful damage to company property.

4. RIGHT OF APPEAL
Employees may appeal any formal disciplinary outcome within 5 working days. Appeals are heard by a senior manager not involved in the original decision.

PART B: GRIEVANCE PROCEDURE

1. PURPOSE
This procedure provides a clear route for employees to raise concerns about their treatment, working conditions, or the actions of colleagues.

2. INFORMAL RESOLUTION
Employees are encouraged to raise concerns informally with their team lead in the first instance. Many issues can be resolved through a direct, honest conversation.

3. FORMAL GRIEVANCE
If informal resolution is not possible or appropriate, the employee submits a written grievance to People & Culture. The grievance should describe the issue, any steps already taken, and the outcome sought.

4. INVESTIGATION
People & Culture appoints an investigating manager who is independent of the matter. The investigation includes interviews with relevant parties and a review of any documentation. The investigation is completed within 10 working days where possible.

5. OUTCOME
The investigating manager communicates the outcome in writing within 5 working days of completing the investigation. Possible outcomes include: no action required, mediation, management action, or disciplinary proceedings against another party.

6. APPEAL
The employee may appeal the grievance outcome within 5 working days. The appeal is heard by a more senior manager or director.

7. CONFIDENTIALITY
All grievance matters are handled with strict confidentiality. Information is shared only with those who need it to resolve the matter.
""".strip()

docs["08_remote_work_policy.txt"] = """
MERIDIAN WORKS REMOTE WORK POLICY
Effective January 2025 | People & Culture

1. ELIGIBILITY
Remote work is available to all employees whose roles can be performed effectively outside the office. Eligibility is determined by the team lead in consultation with People & Culture. Roles requiring physical presence, client-facing duties, or hardware access may not be eligible for full remote work.

2. HYBRID ARRANGEMENT
The default arrangement at Meridian Works is hybrid. Employees are expected to be in the Lagos office a minimum of 2 days per week unless their contract specifies otherwise. Core office days are Tuesday and Thursday. Teams may set additional in-office requirements based on project needs.

3. FULLY REMOTE
Fully remote arrangements may be approved for employees based outside Lagos or in exceptional circumstances. Fully remote employees must be available during core hours (10:00am to 4:00pm WAT) and are expected to travel to Lagos for quarterly team meetings at company expense.

4. HOME OFFICE REQUIREMENTS
Remote employees are responsible for maintaining a suitable work environment. This includes a stable internet connection (minimum 10 Mbps), a quiet workspace, and appropriate security measures for company data. The company provides a home office allowance of 20,000 NGN per month to support this.

5. AVAILABILITY AND COMMUNICATION
Remote employees must be reachable on Slack during working hours and must attend all scheduled meetings via video unless otherwise agreed. Response time expectations are the same as for in-office employees.

6. DATA SECURITY
Remote employees must use the company VPN when accessing internal systems. Company data must not be stored on personal devices or personal cloud accounts. Any security incident must be reported to IT within 1 hour of discovery.

7. EQUIPMENT
Remote employees are provided with a company laptop. Additional peripherals may be requested through IT and are subject to approval. Equipment remains company property and must be returned on termination.

8. PERFORMANCE
Remote employees are held to the same performance standards as office-based employees. Managers monitor output and availability, not hours online. Persistent unavailability or underperformance in a remote arrangement may result in the arrangement being reviewed.

9. CHANGES TO ARRANGEMENT
Remote arrangements are not permanent entitlements and may be reviewed if business needs change. Employees will be given at least 4 weeks notice of any change to their arrangement.
""".strip()

docs["09_it_and_data_security_policy.txt"] = """
MERIDIAN WORKS IT AND DATA SECURITY POLICY
IT Department | Effective January 2025

1. PURPOSE
This policy sets out the rules for the use of Meridian Works IT systems, devices, and data. It applies to all employees, contractors, and anyone accessing company systems.

2. ACCEPTABLE USE
Company IT systems are provided for business purposes. Limited personal use is acceptable provided it does not interfere with work, consume excessive bandwidth, or expose systems to risk. Prohibited uses include accessing illegal content, downloading unlicensed software, and using company systems for personal commercial activity.

3. PASSWORD POLICY
All passwords must be at least 12 characters and include uppercase, lowercase, numbers, and symbols. Passwords must not be shared or reused across systems. The company password manager (1Password) must be used for all work accounts. Passwords must be changed immediately if a breach is suspected.

4. MULTI-FACTOR AUTHENTICATION
MFA is mandatory for all company accounts including email, Slack, Notion, and any system containing client or financial data. Employees who bypass or disable MFA will face immediate disciplinary action.

5. DEVICE SECURITY
All company devices must have full-disk encryption enabled. Devices must be locked when unattended. Lost or stolen devices must be reported to IT immediately. IT reserves the right to remotely wipe any company device.

6. DATA CLASSIFICATION
Company data is classified as: Public, Internal, Confidential, or Restricted. Confidential and Restricted data must not be shared externally without explicit approval. Client data is always classified as Confidential at minimum.

7. DATA STORAGE
Company data must be stored in approved systems only (Google Drive, Notion, Supabase, or other IT-approved platforms). Personal cloud storage (personal Google Drive, Dropbox, iCloud) must not be used for company data.

8. SOFTWARE INSTALLATION
Only IT-approved software may be installed on company devices. Requests for new software are submitted to IT via Slack. Unapproved software installations are a disciplinary offence.

9. INCIDENT REPORTING
Any suspected security incident, including phishing attempts, suspicious access, or data loss, must be reported to IT immediately via it@meridianworks.co or the IT channel on Slack. Delayed reporting may worsen the impact and is itself a policy violation.

10. THIRD PARTY ACCESS
Vendors and contractors requiring access to company systems must be approved by IT and sign a data processing agreement. Access is provisioned with least privilege and reviewed quarterly.

11. POLICY VIOLATIONS
Violations of this policy may result in disciplinary action up to and including termination, depending on severity. Intentional breaches that result in data loss or exposure may also result in legal action.
""".strip()

docs["10_health_and_wellbeing_policy.txt"] = """
MERIDIAN WORKS HEALTH AND WELLBEING POLICY
People & Culture | Effective January 2025

1. COMMITMENT
Meridian Works is committed to supporting the physical and mental health of all employees. We believe that a healthy, supported workforce performs better and stays longer. This policy sets out the support available and the responsibilities of the company and employees.

2. MENTAL HEALTH SUPPORT
All employees have access to free, confidential counselling sessions through our Employee Assistance Programme (EAP). Up to 6 sessions per year are covered at no cost to the employee. The EAP is accessed by contacting people@meridianworks.co who will connect you with the provider. Managers are trained in mental health awareness and are expected to check in regularly with their teams.

3. PHYSICAL HEALTH
The company health insurance plan includes access to general practitioners, specialists, and preventive care. Employees are encouraged to attend regular health checks. A gym subsidy of 15,000 NGN per month is available to all employees and is claimed through the benefits portal.

4. WORK-LIFE BALANCE
Meridian Works does not expect employees to be available outside of working hours. Slack messages and emails sent outside working hours do not require a response until the next working day. Team leads must not create a culture of expectation around out-of-hours availability.

5. STRESS AND WORKLOAD
Employees experiencing unmanageable workload or work-related stress should raise this with their team lead in the first instance. If this is not appropriate, People & Culture can be contacted directly. Workload concerns are taken seriously and will be investigated and addressed.

6. MANAGER RESPONSIBILITIES
Managers are responsible for monitoring the wellbeing of their direct reports, conducting regular 1:1s, flagging concerns to People & Culture early, and not contributing to a culture of overwork. Managers who persistently ignore wellbeing concerns will face management review.

7. PREGNANCY AND NEW PARENTS
Pregnant employees and new parents are entitled to additional support including flexible working arrangements, phased return from leave, and access to a dedicated People & Culture contact throughout the process.

8. SERIOUS ILLNESS
Employees dealing with serious or long-term illness may access an extended sick leave arrangement beyond the standard 10 days. These cases are handled individually and compassionately by People & Culture in consultation with the employee and their medical team.

9. CONFIDENTIALITY
All health and wellbeing matters are treated with strict confidentiality. Information is shared only with those who need it to provide appropriate support.

10. FEEDBACK
Employees are encouraged to share feedback on wellbeing support through the quarterly engagement survey or directly with People & Culture. We review this policy annually.
""".strip()

# Write all files
output_dir = "meridian_docs"
os.makedirs(output_dir, exist_ok=True)

for filename, content in docs.items():
    filepath = os.path.join(output_dir, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Generated: {filepath}")

print(f"\nAll {len(docs)} documents generated in /{output_dir}")