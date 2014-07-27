# --- !Ups

-- UPDATE lgus l
--   SET lgu_lat = ls.avg_lat, lgu_lng = ls.avg_lng
--   FROM (SELECT lgus.lgu_psgc,
--       COALESCE(AVG(lgus_ref.lgu_lat), 0) as avg_lat,
--       COALESCE(AVG(lgus_ref.lgu_lng), 0) as avg_lng
--     FROM lgus
--     LEFT JOIN (SELECT * FROM lgus) as lgus_ref ON lgus_ref.lgu_psgc <@ lgus.lgu_psgc
--     WHERE nlevel(lgus.lgu_psgc) < 4
--     AND nlevel(lgus_ref.lgu_psgc) = 4
--     GROUP BY lgus.lgu_id) as ls
--   WHERE l.lgu_psgc = ls.lgu_psgc

# --- !Downs
