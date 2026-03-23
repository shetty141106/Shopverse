
import java.util.ArrayList;
import java.util.List;
import org.springframework.security.core.authority.SimpleGrantedAuthority;


@Override
protected void doFilterInternal(HttpServletRequest req,
                                HttpServletResponse res,
                                FilterChain chain)
        throws ServletException, IOException {

    String path = req.getRequestURI();

    // ✅ allow frontend
    if (!path.startsWith("/api")) {
        chain.doFilter(req, res);
        return;
    }

    // ✅ allow login/register
    if (path.startsWith("/api/auth")) {
        chain.doFilter(req, res);
        return;
    }

    String header = req.getHeader("Authorization");

    // ✅ if no token → just continue (DON’T block)
    if (header == null || !header.startsWith("Bearer ")) {
        chain.doFilter(req, res);
        return;
    }

    String token = header.substring(7);

    if (!jwtUtil.validateToken(token)) {
        chain.doFilter(req, res);
        return;
    }

    String username = jwtUtil.extractUsername(token);

    // ✅ NORMAL USER ROLE (NOT FORCING ADMIN)
    List<SimpleGrantedAuthority> authorities = new ArrayList<>();
    authorities.add(new SimpleGrantedAuthority("ROLE_USER"));

    UsernamePasswordAuthenticationToken auth =
            new UsernamePasswordAuthenticationToken(username, null, authorities);

    SecurityContextHolder.getContext().setAuthentication(auth);

    chain.doFilter(req, res);
}