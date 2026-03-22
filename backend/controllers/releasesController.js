import db from "../database/db.js";

// Helper: compute status from steps array
export function computeStatus(steps) {
  if (!steps || steps.length === 0) return "planned";
  if (steps.every(s => s === false)) return "planned";
  if (steps.every(s => s === true)) return "done";
  return "ongoing";
}

// GET /api/releases
export const getReleases = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM releases ORDER BY created_at DESC");
    const releases = result.rows.map(r => ({
      ...r,
      status: computeStatus(r.steps)
    }));
    res.json(releases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/releases/:id
export const getReleaseById = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM releases WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Not found" });
    const release = result.rows[0];
    res.json({ ...release, status: computeStatus(release.steps) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/releases
export const createRelease = async (req, res) => {
  const { name, date, additional_info } = req.body;
  if (!name || !date) return res.status(400).json({ error: "Name and date are required" });
  try {
    const result = await db.query(
      "INSERT INTO releases (name, date, additional_info) VALUES ($1, $2, $3) RETURNING *",
      [name, date, additional_info || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/releases/:id
export const updateReleaseInfo = async (req, res) => {
  const { additional_info } = req.body;
  try {
    const result = await db.query(
      "UPDATE releases SET additional_info = $1 WHERE id = $2 RETURNING *",
      [additional_info, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/releases/:id
export const deleteRelease = async (req, res) => {
  try {
    await db.query("DELETE FROM releases WHERE id = $1", [req.params.id]);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/releases/:id/steps/:stepIndex
export const toggleStep = async (req, res) => {
  const { is_completed } = req.body;
  const stepIndex = parseInt(req.params.stepIndex) + 1; // PostgreSQL arrays are 1-indexed
  try {
    const result = await db.query(
      `UPDATE releases SET steps[$1] = $2 WHERE id = $3 RETURNING *`,
      [stepIndex, is_completed, req.params.id]
    );
    const release = result.rows[0];
    res.json({ ...release, status: computeStatus(release.steps) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
