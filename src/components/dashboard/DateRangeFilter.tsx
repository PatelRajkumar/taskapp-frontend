/**
 * DateRangeFilter Component
 * Date range selector with presets and custom range picker
 */

import { useState } from 'react';
import {
    Box,
    FormControl,
    Select,
    MenuItem,
    SelectChangeEvent,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from '@mui/material';
import { CalendarToday } from '@mui/icons-material';
import { format } from 'date-fns';
import { Button } from '@/components/common';
import { DateRangePreset, DATE_RANGE_LABELS } from '@/interceptors/types/dashboard.types';

export interface DateRangeFilterProps {
    /**
     * Current preset value
     */
    value: DateRangePreset;

    /**
     * Callback when preset changes
     */
    onChange: (preset: DateRangePreset) => void;

    /**
     * Current custom range (if preset is CUSTOM)
     */
    customRange?: { start: Date; end: Date } | null;

    /**
     * Callback when custom range changes
     */
    onCustomRangeChange?: (range: { start: Date; end: Date }) => void;
}

/**
 * DateRangeFilter - Preset selector with custom date picker
 * 
 * Features:
 * - Dropdown with preset options (Last 7/30/90 days, All time, Custom)
 * - Custom range opens date picker dialog
 * - Validates custom range (start <= end, end <= today)
 * - Responsive design
 * - Icon indicator
 * 
 * @example
 * const { preset, customRange, setPreset, setCustomRange } = useDateRangeFilter();
 * 
 * <DateRangeFilter
 *   value={preset}
 *   onChange={setPreset}
 *   customRange={customRange}
 *   onCustomRangeChange={setCustomRange}
 * />
 */
export const DateRangeFilter = ({
    value,
    onChange,
    customRange,
    onCustomRangeChange,
}: DateRangeFilterProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [tempStart, setTempStart] = useState<string>('');
    const [tempEnd, setTempEnd] = useState<string>('');
    const [error, setError] = useState<string>('');

    console.log('[DateRangeFilter] Current value:', value, 'Custom range:', customRange);

    const handlePresetChange = (event: SelectChangeEvent<DateRangePreset>) => {
        const newPreset = event.target.value as DateRangePreset;
        console.log('[DateRangeFilter] Preset changed to:', newPreset);

        if (newPreset === DateRangePreset.CUSTOM) {
            // Open custom range dialog
            const today = new Date();
            const defaultStart = new Date(today);
            defaultStart.setMonth(today.getMonth() - 1); // Default to 1 month ago

            setTempStart(format(customRange?.start || defaultStart, 'yyyy-MM-dd'));
            setTempEnd(format(customRange?.end || today, 'yyyy-MM-dd'));
            setError('');
            setDialogOpen(true);
        } else {
            onChange(newPreset);
        }
    };

    const handleDialogClose = () => {
        console.log('[DateRangeFilter] Dialog closed');
        setDialogOpen(false);
        setError('');
    };

    const handleApplyCustomRange = () => {
        console.log('[DateRangeFilter] Applying custom range:', { start: tempStart, end: tempEnd });

        // Validate dates
        const startDate = new Date(tempStart);
        const endDate = new Date(tempEnd);
        const today = new Date();
        today.setHours(23, 59, 59, 999); // End of today

        // Validation: Start must be before or equal to end
        if (startDate > endDate) {
            setError('Start date must be before or equal to end date');
            console.error('[DateRangeFilter] Validation error: Start > End');
            return;
        }

        // Validation: End must not be in the future
        if (endDate > today) {
            setError('End date cannot be in the future');
            console.error('[DateRangeFilter] Validation error: End in future');
            return;
        }

        // Apply custom range
        if (onCustomRangeChange) {
            onCustomRangeChange({ start: startDate, end: endDate });
            onChange(DateRangePreset.CUSTOM);
            console.log('[DateRangeFilter] Custom range applied successfully');
        }

        handleDialogClose();
    };

    // Get display label for custom range
    const getCustomRangeLabel = () => {
        if (customRange) {
            return `${format(customRange.start, 'MMM dd')} - ${format(customRange.end, 'MMM dd, yyyy')}`;
        }
        return DATE_RANGE_LABELS[DateRangePreset.CUSTOM];
    };

    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarToday fontSize="small" color="action" />
                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <Select
                        value={value}
                        onChange={handlePresetChange}
                        displayEmpty
                        sx={{
                            '& .MuiSelect-select': {
                                py: 1,
                            },
                        }}
                    >
                        <MenuItem value={DateRangePreset.LAST_7_DAYS}>
                            {DATE_RANGE_LABELS[DateRangePreset.LAST_7_DAYS]}
                        </MenuItem>
                        <MenuItem value={DateRangePreset.LAST_30_DAYS}>
                            {DATE_RANGE_LABELS[DateRangePreset.LAST_30_DAYS]}
                        </MenuItem>
                        <MenuItem value={DateRangePreset.LAST_90_DAYS}>
                            {DATE_RANGE_LABELS[DateRangePreset.LAST_90_DAYS]}
                        </MenuItem>
                        <MenuItem value={DateRangePreset.ALL_TIME}>
                            {DATE_RANGE_LABELS[DateRangePreset.ALL_TIME]}
                        </MenuItem>
                        <MenuItem value={DateRangePreset.CUSTOM}>
                            {value === DateRangePreset.CUSTOM && customRange
                                ? getCustomRangeLabel()
                                : DATE_RANGE_LABELS[DateRangePreset.CUSTOM]}
                        </MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Custom Range Dialog */}
            <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="xs" fullWidth>
                <DialogTitle>Custom Date Range</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            label="Start Date"
                            type="date"
                            value={tempStart}
                            onChange={(e) => {
                                setTempStart(e.target.value);
                                setError('');
                            }}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            error={!!error}
                        />

                        <TextField
                            label="End Date"
                            type="date"
                            value={tempEnd}
                            onChange={(e) => {
                                setTempEnd(e.target.value);
                                setError('');
                            }}
                            InputLabelProps={{ shrink: true }}
                            inputProps={{
                                max: format(new Date(), 'yyyy-MM-dd'), // Max is today
                            }}
                            fullWidth
                            error={!!error}
                            helperText={error || 'End date cannot be in the future'}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button variant="text" onClick={handleDialogClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleApplyCustomRange}
                        disabled={!tempStart || !tempEnd}
                    >
                        Apply
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DateRangeFilter;