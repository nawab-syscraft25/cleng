export interface CompanyModal{
    companyName: string,
    companyId: number,
    actionBy: string,
    addUpdateCompnayDetails: CompanyDetails[]
    
}

export interface CompanyDetails{
    rownum:number,
    companyDetailId? : number,
    actionType:number,
    companyNo: string,
    companyArea: string,
    assetId: string,
    sapNo: string,
    assetImage: string,
    imageType: string,
    isImage: boolean
}