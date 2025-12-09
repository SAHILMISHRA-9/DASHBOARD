// Backend configuration and endpoint definitions
// Matches the structure from the previous project

const getBackendUrl = () => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || 
              process.env.BACKEND_URL || 
              '';
  
  // Remove trailing slash to avoid double slashes
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

export const backendConfig = {
  baseUrl: getBackendUrl(),
  
  endpoints: {
    // Authentication
    auth: {
      login: '/auth/login',
      createUser: '/phc/users/create',
    },
    
    // Families
    families: {
      list: '/families/list',
      create: '/families/create',
      search: '/families/search',
      getFull: (id) => `/families/${id}/full`,
      setHead: (familyId, memberId) => `/families/${familyId}/set-head/${memberId}`,
      byFamily: (familyId) => `/families/byFamily/${familyId}`,
    },
    
    // Members
    members: {
      add: '/families/add/members',
      getByFamily: (familyId) => `/families/byFamily/${familyId}`,
    },
    
    // Health Records
    health: {
      add: '/health/add',
      list: '/health/list',
      getByMember: (memberId) => `/health/member/${memberId}`,
      getByFamily: (familyId) => `/health/byfamily/${familyId}`,
    },
    
    // PHC Areas
    areas: {
      list: '/phcs/areas/list',
      create: '/phcs/areas/create',
    },
    
    // Tasks
    tasks: {
      list: '/tasks/list',
      create: '/tasks/create',
      update: (taskId) => `/tasks/${taskId}`,
    },
    
    // Sync
    sync: {
      pushFamilies: '/sync/families/push',
      pullFamilies: '/sync/families/pull',
    },
  },
};

export default backendConfig;
