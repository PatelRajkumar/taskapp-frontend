/**
 * Date Range Filter Hook
 * 
 * Manages date range filter state for dashboard.
 * Handles preset selection and custom date range input.
 */

import { useState, useCallback, useMemo } from 'react';
import { startOfDay, endOfDay } from 'date-fns';
import type { DateRangeFilter, DateRangePreset, DateRange } from '@/interceptors/types/dashboard.types';
import { getDateRange } from '@/utils/dashboard.utils';
import { DateRangePreset as Preset } from '@/interceptors/types/dashboard.types';

/**
 * Date range filter hook
 * Manages filter state and provides helpers for updating
 * 
 * @param initialPreset - Initial preset (default: LAST_30_DAYS)
 * @returns Filter state and update functions
 * 
 * @example
 * const {
 *   filter,
 *   preset,
 *   customRange,
 *   dateRange,
 *   setPreset,
 *   setCustomRange,
 *   resetToDefault
 * } = useDateRangeFilter();
 * 
 * // Change to last 7 days
 * setPreset(DateRangePreset.LAST_7_DAYS);
 * 
 * // Set custom range
 * setCustomRange({ start: new Date('2024-01-01'), end: new Date('2024-01-31') });
 */
export const useDateRangeFilter = (
    initialPreset: DateRangePreset = Preset.LAST_30_DAYS
) => {
    console.log('[useDateRangeFilter] Initializing with preset:', initialPreset);

    // State: Current filter configuration
    const [filter, setFilter] = useState<DateRangeFilter>({
        preset: initialPreset,
        customStart: undefined,
        customEnd: undefined,
    });

    /**
     * Computed date range boundaries based on current filter
     */
    const dateRange: DateRange = useMemo(() => {
        const range = getDateRange(filter);
        console.log('[useDateRangeFilter] Computed date range:', {
            start: range.start.toISOString(),
            end: range.end.toISOString(),
        });
        return range;
    }, [filter]);

    /**
     * Update preset
     * Clears custom dates when switching to a preset
     */
    const setPreset = useCallback((preset: DateRangePreset) => {
        console.log('[useDateRangeFilter] Setting preset:', preset);

        setFilter((prev) => {
            // If switching to custom, keep existing custom dates
            if (preset === Preset.CUSTOM) {
                return {
                    preset,
                    customStart: prev.customStart,
                    customEnd: prev.customEnd,
                };
            }

            // Otherwise, clear custom dates
            return {
                preset,
                customStart: undefined,
                customEnd: undefined,
            };
        });
    }, []);

    /**
     * Update custom date range
     * Automatically switches preset to CUSTOM
     */
    const setCustomRange = useCallback((range: { start: Date; end: Date }) => {
        console.log('[useDateRangeFilter] Setting custom range:', {
            start: range.start.toISOString(),
            end: range.end.toISOString(),
        });

        // Validate: start must be before or equal to end
        if (range.start > range.end) {
            console.error('[useDateRangeFilter] Invalid range: start is after end');
            return;
        }

        // Validate: end must not be in the future
        const today = endOfDay(new Date());
        if (range.end > today) {
            console.error('[useDateRangeFilter] Invalid range: end is in the future');
            return;
        }

        setFilter({
            preset: Preset.CUSTOM,
            customStart: startOfDay(range.start),
            customEnd: endOfDay(range.end),
        });
    }, []);

    /**
     * Reset to default preset (LAST_30_DAYS)
     */
    const resetToDefault = useCallback(() => {
        console.log('[useDateRangeFilter] Resetting to default (LAST_30_DAYS)');
        setFilter({
            preset: Preset.LAST_30_DAYS,
            customStart: undefined,
            customEnd: undefined,
        });
    }, []);

    /**
     * Check if current filter is using custom range
     */
    const isCustomRange = filter.preset === Preset.CUSTOM;

    /**
     * Get custom range dates (only if using custom preset)
     */
    const customRange =
        isCustomRange && filter.customStart && filter.customEnd
            ? { start: filter.customStart, end: filter.customEnd }
            : null;

    return {
        // Current filter state
        filter,

        // Convenience accessors
        preset: filter.preset,
        customRange,

        // Computed date range
        dateRange,

        // Update functions
        setPreset,
        setCustomRange,
        resetToDefault,

        // Helpers
        isCustomRange,
    };
};

/**
 * Get hook return type for external usage
 */
export type UseDateRangeFilterReturn = ReturnType<typeof useDateRangeFilter>;