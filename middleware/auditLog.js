import AuditLog from '../models/AuditLog';

const auditLog = async (req, res, next) => {
  const log = new AuditLog({
    user: req.user.id,
    action: req.method,
    endpoint: req.originalUrl,
    data: req.body,
    timestamp: new Date(),
  });
  await log.save();
  next();
};

export default auditLog;
