<%@ Page Language="C#" %>
<%@ Import Namespace="System.Data" %>
<%@ Import Namespace="System.Data.SqlClient" %>
<%@ Import Namespace="System.Web.Script.Serialization" %>

<%
    // Connect to the SQL Server database
    string connectionString = "Data Source=YourServer;Initial Catalog=YourDatabase;User ID=YourUsername;Password=YourPassword";
    using (SqlConnection conn = new SqlConnection(connectionString)) {
        conn.Open();

        // Query the database for data
        string sql = "SELECT * FROM YourTable";
        using (SqlCommand cmd = new SqlCommand(sql, conn)) {
            using (SqlDataReader reader = cmd.ExecuteReader()) {
                // Create a DataTable to hold the data
                DataTable dataTable = new DataTable();
                dataTable.Load(reader);

                // Convert the DataTable to JSON
                JavaScriptSerializer serializer = new JavaScriptSerializer();
                List<Dictionary<string, object>> rows = new List<Dictionary<string, object>>();
                Dictionary<string, object> row;
                foreach (DataRow dr in dataTable.Rows) {
                    row = new Dictionary<string, object>();
                    foreach (DataColumn col in dataTable.Columns) {
                        row.Add(col.ColumnName, dr[col]);
                    }
                    rows.Add(row);
                }
                string json = serializer.Serialize(rows);

                // Send the JSON back to the client
                Response.Clear();
                Response.ContentType = "application/json";
                Response.Write(json);
                Response.End();
            }
        }
    }
%>