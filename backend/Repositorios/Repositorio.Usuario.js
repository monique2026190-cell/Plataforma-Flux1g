
import userQueries from '../database/GestaoDeDados/PostgreSQL/Consultas.Usuario.js';

const createUser = async (userData) => {
    console.log('Calling data management layer to create user.', { 
        event: 'DB_CREATE_USER_START',
        email: userData.email 
    });
    try {
        const newUser = await userQueries.criar(userData);
        console.log('User created successfully in data management.', { 
            event: 'DB_CREATE_USER_SUCCESS',
            userId: newUser.id 
        });
        return newUser; // Retorna dados brutos
    } catch (error) {
        console.error('Error creating user in data management', { 
            event: 'DB_CREATE_USER_ERROR',
            errorMessage: error.message,
            stack: error.stack
        });
        throw error;
    }
};

const findByEmail = async (email) => {
    console.log('Calling data management layer to find user by email.', { 
        event: 'DB_FIND_BY_EMAIL_START',
        email 
    });
    try {
        const user = await userQueries.encontrarPorEmail(email);
        console.log(user ? 'User found.' : 'User not found.', { 
            event: user ? 'DB_FIND_BY_EMAIL_FOUND' : 'DB_FIND_BY_EMAIL_NOT_FOUND',
            email 
        });
        return user; // Retorna dados brutos
    } catch (error) {
        console.error('Error finding user by email in data management', { 
            event: 'DB_FIND_BY_EMAIL_ERROR',
            errorMessage: error.message,
            stack: error.stack
         });
        throw error;
    }
};

const findByGoogleId = async (googleId) => {
    console.log('Calling data management layer to find user by Google ID.', { 
        event: 'DB_FIND_BY_GOOGLE_ID_START',
        googleId 
    });
    try {
        const user = await userQueries.encontrarPorGoogleId(googleId);
        console.log(user ? 'User found.' : 'User not found.', { 
            event: user ? 'DB_FIND_BY_GOOGLE_ID_FOUND' : 'DB_FIND_BY_GOOGLE_ID_NOT_FOUND',
            googleId 
        });
        return user; // Retorna dados brutos
    } catch (error) {
        console.error('Error finding user by Google ID in data management', { 
            event: 'DB_FIND_BY_GOOGLE_ID_ERROR',
            errorMessage: error.message,
            stack: error.stack
         });
        throw error;
    }
};

const updateUser = async (userId, updateData) => {
    console.log('Calling data management layer to update user.', { 
        event: 'DB_UPDATE_USER_START',
        userId 
    });
    try {
        const updatedUser = await userQueries.atualizar(userId, updateData);
        console.log('User updated successfully in data management.', { 
            event: 'DB_UPDATE_USER_SUCCESS',
            userId 
        });
        return updatedUser; // Retorna dados brutos
    } catch (error) {
        console.error('Error updating user in data management', { 
            event: 'DB_UPDATE_USER_ERROR',
            errorMessage: error.message,
            stack: error.stack
        });
        throw error;
    }
};

const userRepository = {
    createUser,
    findByEmail,
    findByGoogleId,
    updateUser,
};

export default userRepository;
