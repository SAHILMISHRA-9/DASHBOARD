// pages/api/settings/index.js
let settings = {
  id: 1,
  phc_name: 'Default PHC',
  address: '',
  contact: '',
  notifications: { email: true, sms: false }
};

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ data: settings });
  }
  if (req.method === 'PUT') {
    const { phc_name, address, contact, notifications } = req.body || {};
    if (phc_name !== undefined) settings.phc_name = phc_name;
    if (address !== undefined) settings.address = address;
    if (contact !== undefined) settings.contact = contact;
    if (notifications !== undefined) settings.notifications = notifications;
    return res.status(200).json({ data: settings });
  }
  if (req.method === 'POST') {
    const { action } = req.body || {};
    if (action === 'reset_password') {
      return res.status(200).json({ success: true });
    }
    return res.status(400).json({ error: 'unknown action' });
  }
  res.setHeader('Allow','GET,PUT,POST');
  res.status(405).end('Method Not Allowed');
}
