export interface ReportDetailsForm {
    companyName? : string;
    reportDate: Date;
    userId: number;
    companyId: number;
    crdId: number;
    collectedBy: string;
    reportTitle: string;
}

export interface CompanyReportResponse {
    status: boolean;
    message: string;
    companyReportDetailsId: number;
    cdrResponses: CDRResponse[];
    companyReportIssues: CompanyReportReadingIssue[];
}

export interface CDRResponse {
    companyReportDetailId: number;
    companyDetailId: number;
    companyNo: string;
    companyArea: string;
    assetId: string;
    sapNo: string;
    currentStatus: ReadingStatus;
}

export interface ReadingStatus {
    globalCodeId: number;
    globalCodeName: string;
}

export interface CompanyReportReadingIssue {
    // valueChanges?: any;
    companyId? : number;
    companyReportDetailIssuesId?: number;
    companyReportDetailId: number;
    companyReportDetailReadingId: number;
    vibrationTypeId: number;
    value: number;
    unitsId: number;
    brgId: number;
    graph?: any[];
    graphImageExsisting: string;
    primaryIssue: string;
    secondaryIssue: string;
    longDescription: string;
    shortDescription: string;
    primaryFaultId: number;
    secondaryFalutId: number;
    priorityNoId: number;
    systemImagesResponses: SystemMedia[];
    systemVideoResponses: SystemMedia[];
    isPublish:boolean;
    issuesImages?: any[];
    issuesVideos?: any[];
    deletedSystemImages?: SystemMedia[];
    deletedSystemVideos?: SystemMedia[];
    current?: boolean;
    companyDetail:companyDetail;
    sendMail?: boolean;
    withoutIssues?: boolean;
}

export interface companyDetail{
    companyArea:string,
    assetId:string,
    companyNo: string,
    stausColor: string

}


export interface SystemMedia
{
    imagesId: number;
    imagesReferenceId: number;
    imageType: number;
    imageUrl: string;
    title: string;
    description: string;
    imageSourceId: number;
}


export interface ReportDetailsFormLoad {
    reportDate: string;
    userId: number;
    companyId: number;
    crdId: number;
    collectedBy: string;
    companyName? : string;
    reportTitle: string;
}