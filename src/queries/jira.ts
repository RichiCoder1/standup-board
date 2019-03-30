import { ModuleInfo } from "../ModuleContext";
import errorEx from 'error-ex';

export async function getDefaultBoard({ xdm_e, projectId }: ModuleInfo) {
    const { values: [defaultBoard] } = await apFetch<any>(`${xdm_e}/rest/agile/1.0/board?projectKeyOrId=${projectId}`);
    return defaultBoard;
}

// function getJiraBoardWebData(baseUrl: string, boardId: number) {
// 	return apFetch(`${baseUrl}/rest/greenhopper/1.0/xboard/work/allData.json?rapidViewId=${boardId}`);
// }

function getJiraBoardConfiguration(baseUrl: string, boardId: number) {
	return apFetch(`${baseUrl}/rest/agile/1.0/board/${boardId}/configuration`);
}

function getJiraBoardSprints(baseUrl: string, boardId: number) {
	return apFetch(`${baseUrl}/rest/agile/1.0/board/${boardId}/sprint`);
}

function getJiraSprintIssues(baseUrl: string, sprintId: number) {
	return apFetch(`${baseUrl}/rest/agile/1.0/sprint/${sprintId}/issue`);
}

interface Sprint {
    sprintDetails: any;
    sprintIssues: { issues: any[] };
}

async function getJiraSprint(baseUrl: string, boardId: number) {
	const sprintData = await getJiraBoardSprints(baseUrl, boardId);
	const activeSprint = sprintData.values.find((sprint: { state: string; }) => sprint.state === 'active');

	const sprint: Sprint = {
        sprintDetails: activeSprint,
        sprintIssues: await getJiraSprintIssues(baseUrl, activeSprint.id)
    };
	return sprint 
}

export async function getJiraBoard({ xdm_e: baseUrl }: ModuleInfo, boardId: number) {
	const [boardConfigData, sprintData, /* webBoardData */] = await Promise.all([
		getJiraBoardConfiguration(baseUrl, boardId),
		getJiraSprint(baseUrl, boardId),
		//getJiraBoardWebData(baseUrl, boardId)
    ]);
    
    apFetch(`${baseUrl}/rest/agile/1.0/sprint/${sprintData.sprintDetails.id}`).then(console.log)
	
	const issueEstimateField = boardConfigData.estimation.field.fieldId;
	const issuesTransformed = sprintData.sprintIssues.issues.map(issue => {
		// eslint-disable-next-line eqeqeq
		// const webIssue = webBoardData.issuesData.issues.find((webIssue: any) => webIssue.id == issue.id);
		// issue.fields.timeInColumn = webIssue.timeInColumn;
		
		// This field is difficult to find.  Copy it to a simpler location.
		issue.fields.estimate = issue.fields[issueEstimateField];
		issue.fields.impediment = issue.fields.customfield_10475 || ''
		return issue;
	});
	
	// copying over only the nececary fields from the web board data 
	const sprintTransformed = sprintData.sprintDetails
	//sprintTransformed.remoteLinks = webBoardData.sprintsData.sprints[0].remoteLinks
	//sprintTransformed.daysRemaining = webBoardData.sprintsData.sprints[0].daysRemaining
	
	return {
		columns: boardConfigData.columnConfig.columns,
		issues: issuesTransformed,
		name: boardConfigData.name,
		sprint: sprintTransformed
	};
}

function apFetch<T = any>(url: string): Promise<T> {
    return AP
        .request<any>(url)
        .then(({ body, xhr }) => {
            if (xhr.status >= 400) {
                const error = new ApRequestError('');
                error.url = url;
                error.xhr = xhr;
                throw error;
            }
            return JSON.parse(body) as T;
        });
}

const ApRequestError = errorEx('ApRequestError', {
    xhr: {
        line({ status, statusText }: any) {
            return `Status Code: ${status} | '${statusText}'`
        }
    },
    url: errorEx.append(`request '%s' failed`)
})