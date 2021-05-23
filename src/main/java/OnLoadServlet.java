import com.google.gson.Gson;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;
import org.json.JSONObject;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;
import java.util.ArrayList;

@WebServlet(name = "OnLoadServlet", value = "/OnLoadServlet")
public class OnLoadServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            String myDriver = "com.mysql.cj.jdbc.Driver";
            Class.forName(myDriver);
            Connection conn = DriverManager.getConnection
                    ("jdbc:mysql://localhost:3306/db1", "user",
                            "20552055");
            Statement st1 = conn.createStatement();
            String q1 = "SELECT * FROM db1.card_db ORDER BY counter DESC ";
            ResultSet rs = st1.executeQuery(q1);
            ArrayList<Card> ae1 = new ArrayList<>();
            while(rs.next()){
                Card emp2 = new Card(rs.getString("id"), rs.getString("title"), rs.getString("descr"),
                        rs.getString("date"));
                ae1.add(emp2);
            }
            String json1 = "";
            Gson gson = new Gson();
            response.setContentType("application/json");
            PrintWriter writer = response.getWriter();
            JSONObject obj = new JSONObject();
            for(int i = 0; i < ae1.size(); i++) {
                json1+=gson.toJson(ae1.get(i));
            }
            obj.put("obj", json1);
            response.setStatus(200);
            writer.append(obj.toString());
            writer.close();
            rs.close();
            st1.close();
            conn.close();
            System.out.println(json1);
        }catch (SQLException | ClassNotFoundException throwables) {
            throwables.printStackTrace();
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }
}
