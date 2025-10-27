import logger from '#config/logger.js';
import { getAllUsers, getUserById, updateUser, deleteUser } from '#services/users.services.js';
import { userIdSchema, updateUserSchema } from '#validations/users.validation.js';
import { formatValidationError } from '#utils/format.js';

export const fetchAllUsers = async (req, res, next) => {
  try {
    logger.info('Getting all users...');

    const allUsers = await getAllUsers();

    res.json({
      message: 'Successfully retrieved Users',
      users: allUsers,
      count: allUsers.length,
    });

  } catch (error) {
    logger.error('Error fetching all users:', error);
    next(error);
  }
};

export const fetchUserById = async (req, res, next) => {
  try {
    const validationResult = userIdSchema.safeParse({ id: req.params.id });

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation Failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const { id } = validationResult.data;
    logger.info(`Getting user with ID: ${id}`);

    const user = await getUserById(id);

    res.json({
      message: 'Successfully retrieved user',
      user,
    });

  } catch (error) {
    logger.error('Error fetching user by ID:', error);
    
    if (error.message === 'User not found') {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found',
      });
    }
    
    next(error);
  }
};

export const updateUserById = async (req, res, next) => {
  try {
    // Validate user ID
    const idValidation = userIdSchema.safeParse({ id: req.params.id });
    if (!idValidation.success) {
      return res.status(400).json({
        error: 'Validation Failed',
        details: formatValidationError(idValidation.error),
      });
    }

    // Validate update data
    const dataValidation = updateUserSchema.safeParse(req.body);
    if (!dataValidation.success) {
      return res.status(400).json({
        error: 'Validation Failed',
        details: formatValidationError(dataValidation.error),
      });
    }

    const { id } = idValidation.data;
    const updates = dataValidation.data;

    // Authorization checks
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    // Users can only update their own information
    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only update your own information',
      });
    }

    // Only admins can change roles
    if (updates.role && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only admins can change user roles',
      });
    }

    logger.info(`Updating user with ID: ${id}`);
    const updatedUser = await updateUser(id, updates);

    res.json({
      message: 'User updated successfully',
      user: updatedUser,
    });

  } catch (error) {
    logger.error('Error updating user:', error);
    
    if (error.message === 'User not found') {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found',
      });
    }
    
    next(error);
  }
};

export const deleteUserById = async (req, res, next) => {
  try {
    const validationResult = userIdSchema.safeParse({ id: req.params.id });

    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation Failed',
        details: formatValidationError(validationResult.error),
      });
    }

    const { id } = validationResult.data;

    // Authorization checks
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    // Users can delete their own account or admins can delete any account
    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only delete your own account',
      });
    }

    logger.info(`Deleting user with ID: ${id}`);
    await deleteUser(id);

    res.json({
      message: 'User deleted successfully',
    });

  } catch (error) {
    logger.error('Error deleting user:', error);
    
    if (error.message === 'User not found') {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found',
      });
    }
    
    next(error);
  }
};
