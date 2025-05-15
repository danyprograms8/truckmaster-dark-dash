
-- Create a function to standardize load statuses
CREATE OR REPLACE FUNCTION public.run_status_cleanup() 
RETURNS void 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
BEGIN
  -- Convert "Active" status to "in_transit"
  UPDATE public.loads 
  SET status = 'in_transit'
  WHERE LOWER(status) = 'active';

  -- Standardize all statuses to normalized format
  UPDATE public.loads 
  SET status = 
    CASE 
      WHEN LOWER(status) IN ('in_transit', 'in transit', 'in-transit', 'intransit') THEN 'in_transit'
      WHEN LOWER(status) IN ('cancelled', 'canceled') THEN 'cancelled'
      WHEN LOWER(status) = 'booked' THEN 'booked'
      WHEN LOWER(status) = 'delivered' THEN 'delivered'
      WHEN LOWER(status) = 'completed' THEN 'completed'
      ELSE LOWER(REPLACE(status, ' ', ''))
    END
  WHERE status IS NOT NULL;
END;
$$;
