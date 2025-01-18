const API_BASE_URL = 'http://localhost:8000/api';

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

export const openChat = async (user_id: string, project_id: string) => {
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




