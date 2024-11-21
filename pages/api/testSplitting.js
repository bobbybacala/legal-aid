
// script to test the spilling of the clauses

function splitIntoClauses(text) {
    // Regular expression to match clause markers
    const clausePattern = /(?=\n[A-Z ]+\s*-\s*\n)|(?=\n?\d+\.\s)|(?=\n?[a-zA-Z]\)\s)/

    // Split the text based on the pattern, trim whitespace, and filter out empty entries
    return text.split(clausePattern)
        .map(clause => clause.trim())
        .filter(clause => clause.length > 0);
}

const text = `EMPLOYMENT CONTRACT 
AGREEMENT
PARTIES -
    This Employment Contract Agreement(hereinafter referred to as the “Agreement”) is entered 
into on November 17, 2024(the “Effective Date”), by and between ABC Corporation, with 
an address of 123 Business Rd, City, State(hereinafter referred to as the “Employer”),
    and  John Doe, with an address of 456 Residential St, City, State(hereinafter referred to as
        the “Employee”)(collectively referred to as the “Parties”). 
DUTIES AND RESPONSIBILITIES - -
    During the employment period, the Employee shall have the responsibility to perform the 
following duties:
1. Manage daily operations and ensure efficient workflow. 
2. Assist in developing and implementing company policies. 
3. Conduct market research and analyze trends to identify new opportunities. 
4. Prepare reports and presentations for management review. 
5. Coordinate with different departments to facilitate communication. 
The Parties agree that any responsibilities provided in this Agreement may not be assigned to 
any other party unless both parties agree to the assignment in writing. 
PAY AND COMPENSATION - -
    The Parties hereby agree that the Employer will pay the Employee an annual salary of $200,000 
payable semi - monthly and subject to regular deductions and withholdings as required by law. 
Whereas the Parties also agree that annual salary may be increased annually by an amount as
    may be approved by the Employer and, upon such increase, the increased amount shall 
thereafter be deemed to be the annual salary for purposes of this Agreement.
    BENEFITS -
    The Parties hereby agree that the Employee shall receive the benefits(Insurance, Holiday and 
Vacation) provided by the Employer as indicated below. 
1. Health Insurance
2. Paid Vacation
3. Retirement Plan 
WORKING HOURS AND LOCATION - -
    The Employee agrees that he / she will be working from 9 AM to 5 PM(Monday to Friday), 
with a 1 - hour lunch break.  
In particular, the Employee agrees that he / she will work on average 40 hours per week. 
-
    The Employee’s place of work shall be in California or such other location as the Parties may 
agree upon from time to time. 
TERMs OF AGREEMENT - -
    This Agreement shall be effective on the date of signing this Agreement(hereinafter referred 
to as the “Effective Date”) and will end on November 17, 2029 
Upon the end of the term of the Agreement, this Agreement will not be automatically 
renewed for a new term.
    TERMINATION - -
    This Agreement may be terminated in case the following occurs:
1. Immediately in case one of the Parties breaches this Agreement. 
2. At any given time by providing a written notice to the other party 30 days prior to 
terminating the Agreement. 
Upon terminating this Agreement, the Employee will be required to return all Employer’s
materials, products or any other content at his / her earliest convenience, but not beyond 30
days.
    CONFIDENTIALITY - -
    All terms and conditions of this Agreement and any materials provided during the term of the 
Agreement must be kept confidential by the Employee, unless the disclosure is required 
pursuant to process of law.  
Disclosing or using this information for any purpose beyond the scope of this Agreement, or 
beyond the exceptions set forth above, is expressly forbidden without the prior consent of the
Employer. 
INTELLECTUAL PROPERTY -
    Hereby, the Employee agrees that any intellectual property provided to him / her by the 
Employer will remain the sole property of the Employer including, but not limited to,
    copyrights, patents, trade secret rights, and other intellectual property rights associated with 
any ideas, concepts, techniques, inventions, processes, works of authorship, Confidential 
Information or trade secrets.
    EXCLUSIVITY - -
    The Parties agree that this Agreement is not an exclusive arrangement and that the Employer 
is entitled to enter into other similar agreements with other employees.
    However, the Employee is not entitled to enter into a similar agreement as long as he / she 
remains a party to this Agreement. 
LIMITATION OF LIABILITY -
    In no event shall the Employer nor the Employee be individually liable for any damages for 
breach of duty by third parties, unless the Employer’s or Employee’s act or failure to act 
involves intentional misconduct, fraud, or a knowing violation of the law.
    SEVERABILITY
    -
    In an event where any provision of this Agreement is found to be void and unenforceable by a 
court of competent jurisdiction, then the remaining provisions will remain to be enforced in
    accordance with the Parties’ intention. 
GOVERNING LAW -
    This Agreement shall be governed by and construed in accordance with the laws of State of
California. 
ALTERNATIVE DISPUTE RESOLUTION -
    Any dispute or difference whatsoever arising out of or in connection with this Agreement shall 
be submitted to Arbitration(Arbitration / mediation / negotiation) in accordance with, and 
subject to the laws of Governing laws for dispute resolution. 
ATTORNEY FEES -
        In the event of any dispute between the parties concerning the terms and provisions of this
Agreement, the party prevailing in such dispute shall be entitled to collect from the other party 
all costs incurred in such dispute, including reasonable attorneys’ fees. 
ENTIRE AGREEMENT -
    This Agreement contains the entire agreement and understanding among the Parties hereto
with respect to the subject matter hereof, and supersedes all prior agreements, understandings,
    inducements and conditions, express or implied, oral or written, of any nature whatsoever with 
respect to the subject matter hereof.The express terms hereof control and supersede any course 
of performance and / or usage of the trade inconsistent with any of the terms hereof.
    AMENDMENTS - -
    The Parties agree that any amendments made to this Agreement must be in writing where they 
must be signed by both Parties to this Agreement.  
As such, any amendments made by the Parties will be applied to this Agreement. 
SIGNATURE AND DATE -
    The Parties hereby agree to the terms and conditions set forth in this Agreement and such is 
demonstrated throughout by their signatures below:
EMPLOYEE
Signature: _________________________
EMPLOYER
Signature: _________________________ `

console.log(splitIntoClauses(text))