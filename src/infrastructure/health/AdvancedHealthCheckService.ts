import { inject, injectable } from 'inversify';
import si from 'systeminformation';
import { TYPES } from '../di/types';
import { MongoConnection } from '../database/MongoConnection';

export interface SystemMetrics {
  cpu: {
    load: number;
    cores: number;
    model: string;
  };
  memory: {
    total: number;
    used: number;
    free: number;
    percentage: number;
  };
  disk: {
    total: number;
    used: number;
    free: number;
    percentage: number;
  };
  uptime: number;
}

export interface AdvancedHealthCheckResult {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  database: {
    status: 'connected' | 'disconnected';
    responseTime: number;
    error?: string;
  };
  system: SystemMetrics;
  checks: {
    database: boolean;
    system: boolean;
    memory: boolean;
    disk: boolean;
  };
}

@injectable()
export class AdvancedHealthCheckService {
  constructor(
    @inject(TYPES.MongoConnection) private mongoConnection: MongoConnection
  ) {}

  async performAdvancedHealthCheck(): Promise<AdvancedHealthCheckResult> {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();
    const uptime = process.uptime();

    try {
      const [dbCheck, systemMetrics] = await Promise.all([
        this.checkDatabase(),
        this.getSystemMetrics(),
      ]);

      const checks = {
        database: dbCheck.status === 'connected',
        system: systemMetrics !== null,
        memory:
          systemMetrics?.memory.percentage !== undefined &&
          systemMetrics.memory.percentage < 90,
        disk:
          systemMetrics?.disk.percentage !== undefined &&
          systemMetrics.disk.percentage < 90,
      };

      const overallStatus = this.determineOverallStatus(checks);

      return {
        status: overallStatus,
        timestamp,
        uptime,
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        database: dbCheck,
        system: systemMetrics!,
        checks,
      };
    } catch {
      return {
        status: 'unhealthy',
        timestamp,
        uptime,
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        database: {
          status: 'disconnected',
          responseTime: Date.now() - startTime,
          error: 'Unknown error',
        },
        system:
          (await this.getSystemMetrics()) || this.getDefaultSystemMetrics(),
        checks: {
          database: false,
          system: false,
          memory: false,
          disk: false,
        },
      };
    }
  }

  private async checkDatabase(): Promise<{
    status: 'connected' | 'disconnected';
    responseTime: number;
    error?: string;
  }> {
    const startTime = Date.now();
    try {
      const db = this.mongoConnection.getDatabase();
      await db.admin().ping();
      return {
        status: 'connected',
        responseTime: Date.now() - startTime,
      };
    } catch (error) {
      return {
        status: 'disconnected',
        responseTime: Date.now() - startTime,
        error:
          error instanceof Error ? error.message : 'Database connection failed',
      };
    }
  }

  private async getSystemMetrics(): Promise<SystemMetrics | null> {
    try {
      const [cpu, mem, disk, time] = await Promise.all([
        si.currentLoad(),
        si.mem(),
        si.fsSize(),
        si.time(),
      ]);

      const diskInfo = disk[0] || { size: 0, used: 0, available: 0 };

      return {
        cpu: {
          load: cpu.currentLoad,
          cores: cpu.cpus.length,
          model: 'Unknown',
        },
        memory: {
          total: mem.total,
          used: mem.used,
          free: mem.free,
          percentage: (mem.used / mem.total) * 100,
        },
        disk: {
          total: diskInfo.size,
          used: diskInfo.used,
          free: diskInfo.available,
          percentage: (diskInfo.used / diskInfo.size) * 100,
        },
        uptime: time.uptime,
      };
    } catch {
      return null;
    }
  }

  private getDefaultSystemMetrics(): SystemMetrics {
    return {
      cpu: { load: 0, cores: 0, model: 'Unknown' },
      memory: { total: 0, used: 0, free: 0, percentage: 0 },
      disk: { total: 0, used: 0, free: 0, percentage: 0 },
      uptime: 0,
    };
  }

  private determineOverallStatus(checks: {
    database: boolean;
    system: boolean;
    memory: boolean;
    disk: boolean;
  }): 'healthy' | 'unhealthy' | 'degraded' {
    if (checks.database && checks.system && checks.memory && checks.disk) {
      return 'healthy';
    }
    if (checks.database && checks.system) {
      return 'degraded';
    }
    return 'unhealthy';
  }
}
