import { useEffect, useState } from 'react';
import { DangerousZone } from '../interfaces/DangerousZone';
import { dangerousZoneService } from '../services/dangerousZoneService';

export const useZones = () => {
    const [zones, setZones] = useState<DangerousZone[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadZones = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await dangerousZoneService.getAll();

            setZones(data);
        } catch (err) {
            console.error("Failed to load zones", err);
            setError(err instanceof Error ? err.message : 'Failed to load zones');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadZones();
    }, []);

    return { zones, loading, error, refetch: loadZones };
};
