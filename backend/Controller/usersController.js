import db from '../config/db.js';

const getUsers = (req, res) => {
  db.query(
    `SELECT id, name, email, role, created_at
     FROM users
     ORDER BY id DESC`,
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to fetch users', error: err.message });
      }

      return res.status(200).json({
        success: true,
        data: results,
      });
    }
  );
};

const deleteUser = (req, res) => {
  const { id } = req.params;

  if (!id || Number.isNaN(Number(id))) {
    return res.status(400).json({ message: 'Valid user id is required' });
  }

  db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to delete user', error: err.message });
    }

    if (!result.affectedRows) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  });
};

export { getUsers, deleteUser };
