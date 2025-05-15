
-- Create a function to standardize load statuses
CREATE OR REPLACE FUNCTION public.run_status_cleanup() 
RETURNS void 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
BEGIN
  -- Standardize all statuses to normalized format
  UPDATE public.loads 
  SET status = 
    CASE 
      WHEN LOWER(status) IN ('in_transit', 'in transit', 'in-transit', 'intransit') THEN 'in_transit'
      WHEN LOWER(status) IN ('cancelled', 'canceled') THEN 'cancelled'
      WHEN LOWER(status) = 'active' THEN 'active'
      WHEN LOWER(status) = 'booked' THEN 'booked'
      WHEN LOWER(status) = 'delivered' THEN 'delivered'
      WHEN LOWER(status) = 'completed' THEN 'completed'
      ELSE LOWER(REPLACE(status, ' ', ''))
    END
  WHERE status IS NOT NULL;
END;
$$;
