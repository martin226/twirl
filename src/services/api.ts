const API_BASE_URL = 'http://localhost:8000/api';

export const executePipeline = async (nodes: any[], connections: any[]) => {
    const response = await fetch(`${API_BASE_URL}/execute-pipeline/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nodes, connections }),
    });

    if (!response.ok) {
        throw new Error('Pipeline execution failed');
    }

    return response.json();
}; 

export const newProject = async (
    user_id: string, 
    project_name: string, 
    collaborators: any[],
    isPublic: boolean
) => {
    const response = await fetch(`${API_BASE_URL}/new-project/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            user_id, 
            project_name, 
            collaborators,
            is_public: isPublic 
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to create new project');
    }

    return response.json();
};

export const fetchAllUsers = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/all-users/`);
        const data = await response.json();
        return data.users;
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};

export const fetchAllProjects = async (user_id: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/all-projects/?user_id=${user_id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        return data.projects;
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
};

export const deleteProject = async (project_id: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/delete-project/?project_id=${project_id}`, { method: 'DELETE' });
        if (!response.ok) {
            throw new Error('Failed to delete project');
        }
        return response.status;
    } catch (error) {
        console.error('Error deleting project:', error);
        return [];
    }
};

export const openWhiteboard = async (user_id: string, project_id: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Whiteboard/${project_id}/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id, project_id }),
        });
        if (response.status === 404) {
            return null;
        }
        if (!response.ok) {
            throw new Error('Failed to fetch project');
        }

        const data = await response.json();
        return data.project;
    } catch (error) {
        console.error('Error opening Whiteboard:', error);
        return null;
    }
};


export const uploadWhiteboard = async (user_id: string, project: any) => {
    try {
        const response = await fetch(`${API_BASE_URL}/upload-Whiteboard/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id, project }),
        });

        if (!response.ok) {
            throw new Error('Failed to save project');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error saving Whiteboard:', error);
        return null;
    }
};


