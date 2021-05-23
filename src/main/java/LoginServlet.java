import com.google.gson.Gson;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.sql.*;

@WebServlet(name = "LoginServlet", value = "/LoginServlet")
public class LoginServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(request.getInputStream()));
        String credentials = br.readLine();
        Gson gson = new Gson();
        User user = gson.fromJson(credentials, User.class);
        br.close();
        try {
            String myDriver = "com.mysql.cj.jdbc.Driver";
            Class.forName(myDriver);
            Connection conn = DriverManager.getConnection
                    ("jdbc:mysql://localhost:3306/db1", "user",
                            "20552055");
            Statement st0 = conn.createStatement();
            String SQL_SELECT = "SELECT password FROM user_valid WHERE login = '" + user.getLogin() + "'";
            ResultSet rs0 = st0.executeQuery(SQL_SELECT);
             rs0.next();
          if(rs0.getString("password").equals(user.getPassword()))
              response.setStatus(200);
          else response.setStatus(500);
           conn.close();

        } catch (SQLException | ClassNotFoundException throwables){
            response.setStatus(500);
        }
    }
}
