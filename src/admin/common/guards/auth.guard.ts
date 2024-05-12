import { StrategyName } from '@/admin/auth/auth.service'
import { createAuthGuard } from '@/common/auth'

export const AdminAuthGuard = createAuthGuard(StrategyName)
