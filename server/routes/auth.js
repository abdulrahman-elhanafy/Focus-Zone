import express from 'express';

const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'recep' && password === '123') {
    return res.json({ id: 'u1', name: 'Menna', role: 'receptionist', avatar: 'https://ui-avatars.com/api/?name=Menna&background=FBB315&color=1e3554' });
  }
  if (username === 'owner' && password === '123') {
    return res.json({ id: 'u2', name: 'Abdulrahman', role: 'owner', avatar: 'https://ui-avatars.com/api/?name=Abdulrahman&background=FBB315&color=1e3554' });
  }
  if (username === 'acct' && password === '123') {
    return res.json({ id: 'u3', name: 'Mohammed', role: 'accountant', avatar: 'https://ui-avatars.com/api/?name=Mohammed&background=FBB315&color=1e3554' });
  }
  
  return res.status(401).json({ error: 'Invalid credentials' });
});

export default router;
