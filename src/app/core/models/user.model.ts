export interface UserModel{
    // Syscraft comment
    // assignCompanyIdRequests ?: CompanyId[],
    assignCompanyIdRequests: CompanyId[],
    accountTypeId ?: number,
    userName: string,
    phoneNumber:string,
    email: string,
    contactName: string,
    password: string,
    url?: string,
    actionBy?: string,
    userId?: number
}

export interface CompanyId{
    rownum?:number,
    companyId: number;
}